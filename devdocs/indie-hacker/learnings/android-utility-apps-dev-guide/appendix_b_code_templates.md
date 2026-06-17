# Appendix B: Code Templates

## 1. Basic App Structure

### Project Setup
```kotlin
// build.gradle.kts (Project)
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.0")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.0")
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.48")
    }
}

// build.gradle.kts (App)
plugins {
    id("com.android.application")
    id("kotlin-android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
}

android {
    namespace = "com.example.aiapp"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.example.aiapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.0"
    }
}

dependencies {
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    
    // Compose
    implementation(platform("androidx.compose:compose-bom:2023.10.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    
    // Dependency Injection
    implementation("com.google.dagger:hilt-android:2.48")
    kapt("com.google.dagger:hilt-android-compiler:2.48")
    
    // AI/ML
    implementation("org.tensorflow:tensorflow-lite:2.14.0")
    implementation("org.tensorflow:tensorflow-lite-support:0.4.4")
    implementation("com.google.mlkit:vision-common:17.3.0")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
```

### Application Class
```kotlin
@HiltAndroidApplication
class AIApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        setupAI()
        setupLogging()
    }
    
    private fun setupAI() {
        // Initialize AI components
        AIManager.initialize(this)
    }
    
    private fun setupLogging() {
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
    }
}
```

## 2. AI Integration Boilerplate

### ML Model Manager
```kotlin
@Singleton
class MLModelManager @Inject constructor(
    private val context: Context,
    private val modelConfig: ModelConfig
) {
    private var interpreter: Interpreter? = null
    private val modelOperations = ModelOperations()
    
    suspend fun loadModel() = withContext(Dispatchers.IO) {
        try {
            val model = loadModelFile()
            val options = Interpreter.Options()
                .setNumThreads(4)
                .setUseNNAPI(true)
            
            interpreter = Interpreter(model, options)
            Timber.d("Model loaded successfully")
        } catch (e: Exception) {
            Timber.e(e, "Error loading model")
            throw ModelLoadException("Failed to load model", e)
        }
    }
    
    suspend fun runInference(
        input: ByteBuffer
    ): FloatArray = withContext(Dispatchers.Default) {
        checkNotNull(interpreter) { "Interpreter not initialized" }
        
        val outputBuffer = ByteBuffer.allocateDirect(modelConfig.outputSize * 4)
            .order(ByteOrder.nativeOrder())
        
        try {
            interpreter?.run(input, outputBuffer)
            return@withContext modelOperations.processOutput(outputBuffer)
        } catch (e: Exception) {
            Timber.e(e, "Inference error")
            throw InferenceException("Failed to run inference", e)
        }
    }
    
    private fun loadModelFile(): MappedByteBuffer {
        return context.assets.openFd(modelConfig.modelName)
            .use { fileDescriptor ->
                FileInputStream(fileDescriptor.fileDescriptor).use { inputStream ->
                    val startOffset = fileDescriptor.startOffset
                    val length = fileDescriptor.length
                    FileChannel.MapMode.READ_ONLY.let { mode ->
                        inputStream.channel.map(mode, startOffset, length)
                    }
                }
            }
    }
}
```

### AI Processing Pipeline
```kotlin
class AIPipeline @Inject constructor(
    private val preprocessor: Preprocessor,
    private val modelManager: MLModelManager,
    private val postprocessor: Postprocessor
) {
    suspend fun process(
        input: ProcessingInput
    ): ProcessingResult = withContext(Dispatchers.Default) {
        try {
            // Pre-processing
            val preprocessed = preprocessor.process(input)
            
            // Model inference
            val inference = modelManager.runInference(preprocessed)
            
            // Post-processing
            postprocessor.process(inference)
        } catch (e: Exception) {
            Timber.e(e, "Processing pipeline error")
            throw PipelineException("Processing failed", e)
        }
    }
    
    class Preprocessor @Inject constructor() {
        suspend fun process(input: ProcessingInput): ByteBuffer {
            return withContext(Dispatchers.Default) {
                ByteBuffer.allocateDirect(input.size * 4)
                    .order(ByteOrder.nativeOrder())
                    .apply {
                        // Normalize and prepare input
                        input.data.forEach { value ->
                            putFloat(value / 255.0f)
                        }
                        rewind()
                    }
            }
        }
    }
    
    class Postprocessor @Inject constructor() {
        suspend fun process(
            inference: FloatArray
        ): ProcessingResult = withContext(Dispatchers.Default) {
            // Process model output
            ProcessingResult(
                predictions = inference.toList(),
                confidence = calculateConfidence(inference)
            )
        }
    }
}
```

## 3. Common Utilities

### Performance Monitoring
```kotlin
object PerformanceMonitor {
    private val metrics = mutableMapOf<String, MetricData>()
    
    fun startMetric(name: String) {
        metrics[name] = MetricData(
            startTime = System.nanoTime(),
            endTime = 0L
        )
    }
    
    fun endMetric(name: String) {
        metrics[name]?.let { data ->
            data.endTime = System.nanoTime()
            logMetric(name, data)
        }
    }
    
    private fun logMetric(name: String, data: MetricData) {
        val duration = (data.endTime - data.startTime) / 1_000_000 // Convert to ms
        Timber.d("$name took $duration ms")
    }
    
    data class MetricData(
        val startTime: Long,
        var endTime: Long
    )
}
```

### Error Handling
```kotlin
sealed class AIError : Exception() {
    class ModelLoadError(message: String, cause: Throwable? = null) : 
        AIError()
    class InferenceError(message: String, cause: Throwable? = null) : 
        AIError()
    class ProcessingError(message: String, cause: Throwable? = null) : 
        AIError()
}

class ErrorHandler {
    fun handle(error: AIError) {
        when (error) {
            is AIError.ModelLoadError -> handleModelLoadError(error)
            is AIError.InferenceError -> handleInferenceError(error)
            is AIError.ProcessingError -> handleProcessingError(error)
        }
    }
    
    private fun handleModelLoadError(error: AIError.ModelLoadError) {
        Timber.e(error, "Model load error")
        // Implement recovery strategy
    }
    
    private fun handleInferenceError(error: AIError.InferenceError) {
        Timber.e(error, "Inference error")
        // Implement fallback
    }
    
    private fun handleProcessingError(error: AIError.ProcessingError) {
        Timber.e(error, "Processing error")
        // Implement retry logic
    }
}
```

### Resource Management
```kotlin
class ResourceManager @Inject constructor(
    private val context: Context
) {
    private val memoryWatcher = MemoryWatcher()
    private val batteryMonitor = BatteryMonitor(context)
    
    fun optimizeResources() {
        memoryWatcher.checkMemory()
        batteryMonitor.checkBattery()
    }
    
    inner class MemoryWatcher {
        private val runtime = Runtime.getRuntime()
        
        fun checkMemory() {
            val maxMemory = runtime.maxMemory()
            val usedMemory = runtime.totalMemory() - runtime.freeMemory()
            val freeMemory = maxMemory - usedMemory
            
            if (freeMemory < MEMORY_THRESHOLD) {
                // Implement memory optimization
                runtime.gc()
            }
        }
    }
    
    inner class BatteryMonitor(context: Context) {
        private val powerManager = 
            context.getSystemService(Context.POWER_SERVICE) as PowerManager
        
        fun checkBattery() {
            if (powerManager.isPowerSaveMode) {
                // Adjust processing strategy
                adjustProcessingStrategy()
            }
        }
    }
}
```

## 4. Best Practices Implementation

### Dependency Injection
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AIModule {
    @Provides
    @Singleton
    fun provideMLModelManager(
        @ApplicationContext context: Context,
        modelConfig: ModelConfig
    ): MLModelManager {
        return MLModelManager(context, modelConfig)
    }
    
    @Provides
    @Singleton
    fun provideAIPipeline(
        preprocessor: Preprocessor,
        modelManager: MLModelManager,
        postprocessor: Postprocessor
    ): AIPipeline {
        return AIPipeline(preprocessor, modelManager, postprocessor)
    }
}
```

### Repository Pattern
```kotlin
interface AIRepository {
    suspend fun processInput(input: ProcessingInput): ProcessingResult
    suspend fun loadModel()
    suspend fun clearCache()
}

class AIRepositoryImpl @Inject constructor(
    private val aiPipeline: AIPipeline,
    private val modelManager: MLModelManager,
    private val cache: Cache
) : AIRepository {
    override suspend fun processInput(
        input: ProcessingInput
    ): ProcessingResult = withContext(Dispatchers.IO) {
        // Check cache
        cache.get(input.hashCode())?.let { return@withContext it }
        
        // Process input
        val result = aiPipeline.process(input)
        
        // Cache result
        cache.put(input.hashCode(), result)
        
        result
    }
    
    override suspend fun loadModel() {
        modelManager.loadModel()
    }
    
    override suspend fun clearCache() {
        cache.clear()
    }
}
```

### ViewModel Implementation
```kotlin
@HiltViewModel
class AIViewModel @Inject constructor(
    private val repository: AIRepository,
    private val errorHandler: ErrorHandler
) : ViewModel() {
    private val _state = MutableStateFlow<AIState>(AIState.Initial)
    val state: StateFlow<AIState> = _state.asStateFlow()
    
    fun processInput(input: ProcessingInput) {
        viewModelScope.launch {
            _state.value = AIState.Processing
            
            try {
                val result = repository.processInput(input)
                _state.value = AIState.Success(result)
            } catch (e: Exception) {
                errorHandler.handle(e as? AIError ?: AIError.ProcessingError(e.message ?: ""))
                _state.value = AIState.Error(e)
            }
        }
    }
    
    sealed class AIState {
        object Initial : AIState()
        object Processing : AIState()
        data class Success(val result: ProcessingResult) : AIState()
        data class Error(val error: Exception) : AIState()
    }
}
```

### UI Implementation
```kotlin
@Composable
fun AIScreen(
    viewModel: AIViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        when (val currentState = state) {
            is AIState.Initial -> InitialContent()
            is AIState.Processing -> LoadingContent()
            is AIState.Success -> SuccessContent(currentState.result)
            is AIState.Error -> ErrorContent(currentState.error)
        }
    }
}

@Composable
private fun SuccessContent(result: ProcessingResult) {
    Column {
        Text(
            text = "Results",
            style = MaterialTheme.typography.headlineMedium
        )
        
        LazyColumn {
            items(result.predictions) { prediction ->
                PredictionItem(prediction)
            }
        }
    }
}
```

These templates provide a solid foundation for building AI-powered Android apps, following best practices and modern Android development patterns. They can be customized and extended based on specific app requirements.
