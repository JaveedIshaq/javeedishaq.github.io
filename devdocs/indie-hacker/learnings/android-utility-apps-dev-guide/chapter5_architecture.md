# Chapter 5: Architecture and Design for AI-Powered Android Apps

## MVVM Architecture Implementation

### 1. Project Structure
```kotlin
app/
├── data/
│   ├── repository/
│   ├── local/
│   └── models/
├── domain/
│   ├── usecase/
│   └── repository/
├── presentation/
│   ├── ui/
│   ├── viewmodel/
│   └── adapter/
└── core/
    ├── ai/
    ├── util/
    └── di/
```

### 2. ViewModel Implementation
```kotlin
class ImageProcessingViewModel @Inject constructor(
    private val imageProcessor: ImageProcessorUseCase,
    private val modelManager: AIModelManager
) : ViewModel() {

    private val _processingState = MutableStateFlow<ProcessingState>(ProcessingState.Idle)
    val processingState: StateFlow<ProcessingState> = _processingState.asStateFlow()

    fun processImage(imageUri: Uri) {
        viewModelScope.launch {
            _processingState.value = ProcessingState.Processing
            try {
                val result = imageProcessor.process(imageUri)
                _processingState.value = ProcessingState.Success(result)
            } catch (e: Exception) {
                _processingState.value = ProcessingState.Error(e.message)
            }
        }
    }

    sealed class ProcessingState {
        object Idle : ProcessingState()
        object Processing : ProcessingState()
        data class Success(val result: ProcessingResult) : ProcessingState()
        data class Error(val message: String?) : ProcessingState()
    }
}
```

### 3. Repository Pattern
```kotlin
interface ImageRepository {
    suspend fun processImage(uri: Uri): ProcessingResult
    suspend fun saveResult(result: ProcessingResult)
    fun getProcessedImages(): Flow<List<ProcessingResult>>
}

class ImageRepositoryImpl @Inject constructor(
    private val localDataSource: LocalDataSource,
    private val aiProcessor: AIImageProcessor
) : ImageRepository {

    override suspend fun processImage(uri: Uri): ProcessingResult {
        return withContext(Dispatchers.Default) {
            val bitmap = loadBitmap(uri)
            val result = aiProcessor.process(bitmap)
            localDataSource.saveResult(result)
            result
        }
    }

    override fun getProcessedImages(): Flow<List<ProcessingResult>> {
        return localDataSource.getAllResults()
    }
}
```

## Clean Architecture for AI Components

### 1. Use Case Implementation
```kotlin
class ProcessImageUseCase @Inject constructor(
    private val repository: ImageRepository,
    private val modelManager: AIModelManager
) {
    suspend operator fun invoke(
        imageUri: Uri,
        processingOptions: ProcessingOptions
    ): Result<ProcessingResult> = withContext(Dispatchers.Default) {
        try {
            val model = modelManager.getModel(processingOptions.modelType)
            val result = repository.processImage(imageUri)
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

### 2. Domain Models
```kotlin
data class ProcessingResult(
    val id: String = UUID.randomUUID().toString(),
    val timestamp: Long = System.currentTimeMillis(),
    val type: ProcessingType,
    val confidence: Float,
    val metadata: Map<String, Any>
)

enum class ProcessingType {
    OBJECT_DETECTION,
    IMAGE_CLASSIFICATION,
    TEXT_RECOGNITION,
    FACE_DETECTION
}
```

## AI Module Integration

### 1. AI Service Provider
```kotlin
@Singleton
class AIServiceProvider @Inject constructor(
    private val context: Context,
    private val modelManager: ModelManager
) {
    private var classifier: ImageClassifier? = null
    private var objectDetector: ObjectDetector? = null

    init {
        initializeAIComponents()
    }

    private fun initializeAIComponents() {
        viewModelScope.launch(Dispatchers.IO) {
            classifier = ImageClassifier(
                context = context,
                model = modelManager.getModel(ModelType.CLASSIFIER)
            )
            objectDetector = ObjectDetector(
                context = context,
                model = modelManager.getModel(ModelType.OBJECT_DETECTION)
            )
        }
    }

    suspend fun classify(bitmap: Bitmap): ClassificationResult {
        return withContext(Dispatchers.Default) {
            classifier?.classify(bitmap) ?: throw AIServiceException("Classifier not initialized")
        }
    }
}
```

### 2. Model Management
```kotlin
@Singleton
class ModelManager @Inject constructor(
    private val context: Context,
    private val preferences: SharedPreferences
) {
    private val modelCache = mutableMapOf<String, Model>()

    suspend fun getModel(type: ModelType): Model {
        return modelCache.getOrPut(type.name) {
            loadModel(type)
        }
    }

    private suspend fun loadModel(type: ModelType): Model {
        return withContext(Dispatchers.IO) {
            val modelFile = context.assets.open("models/${type.fileName}")
            Model.create(modelFile.readBytes())
        }
    }

    fun releaseModel(type: ModelType) {
        modelCache[type.name]?.close()
        modelCache.remove(type.name)
    }
}
```

## Data Flow Design

### 1. Unidirectional Data Flow
```kotlin
sealed class AIEvent {
    data class ProcessImage(val uri: Uri) : AIEvent()
    data class UpdateSettings(val settings: AISettings) : AIEvent()
    object ClearResults : AIEvent()
}

data class AIViewState(
    val isProcessing: Boolean = false,
    val results: List<ProcessingResult> = emptyList(),
    val error: String? = null,
    val settings: AISettings = AISettings()
)

class AIViewModel @Inject constructor(
    private val processImageUseCase: ProcessImageUseCase,
    private val settingsManager: SettingsManager
) : ViewModel() {

    private val _viewState = MutableStateFlow(AIViewState())
    val viewState: StateFlow<AIViewState> = _viewState.asStateFlow()

    fun handleEvent(event: AIEvent) {
        when (event) {
            is AIEvent.ProcessImage -> processImage(event.uri)
            is AIEvent.UpdateSettings -> updateSettings(event.settings)
            AIEvent.ClearResults -> clearResults()
        }
    }
}
```

### 2. State Management
```kotlin
class StateManager @Inject constructor() {
    private val _processingState = MutableStateFlow<ProcessingState>(ProcessingState.Idle)
    val processingState: StateFlow<ProcessingState> = _processingState.asStateFlow()

    private val _modelState = MutableStateFlow<ModelState>(ModelState.NotLoaded)
    val modelState: StateFlow<ModelState> = _modelState.asStateFlow()

    fun updateProcessingState(state: ProcessingState) {
        _processingState.value = state
    }

    fun updateModelState(state: ModelState) {
        _modelState.value = state
    }
}
```

## Performance Optimization

### 1. Coroutines Implementation
```kotlin
class CoroutineAIProcessor @Inject constructor(
    private val aiService: AIServiceProvider,
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default
) {
    private val processingScope = CoroutineScope(dispatcher + SupervisorJob())

    fun processImage(
        bitmap: Bitmap,
        onProgress: (Float) -> Unit,
        onResult: (Result<ProcessingResult>) -> Unit
    ) {
        processingScope.launch {
            try {
                val result = withContext(dispatcher) {
                    val preprocessed = preprocessImage(bitmap)
                    onProgress(0.3f)
                    
                    val processed = aiService.process(preprocessed)
                    onProgress(0.7f)
                    
                    postprocessResult(processed)
                }
                onProgress(1.0f)
                onResult(Result.success(result))
            } catch (e: Exception) {
                onResult(Result.failure(e))
            }
        }
    }
}
```

### 2. Memory Management
```kotlin
class ResourceManager {
    private val resources = mutableListOf<AutoCloseable>()

    fun <T : AutoCloseable> T.manage(): T {
        resources.add(this)
        return this
    }

    fun releaseResources() {
        resources.forEach { resource ->
            try {
                resource.close()
            } catch (e: Exception) {
                Log.e("ResourceManager", "Error releasing resource", e)
            }
        }
        resources.clear()
    }
}
```

## Dependency Injection

### 1. Hilt Module Configuration
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AIModule {
    
    @Provides
    @Singleton
    fun provideAIServiceProvider(
        @ApplicationContext context: Context,
        modelManager: ModelManager
    ): AIServiceProvider {
        return AIServiceProvider(context, modelManager)
    }

    @Provides
    @Singleton
    fun provideModelManager(
        @ApplicationContext context: Context,
        preferences: SharedPreferences
    ): ModelManager {
        return ModelManager(context, preferences)
    }
}
```

### 2. ViewModel Injection
```kotlin
@HiltViewModel
class MainViewModel @Inject constructor(
    private val aiProcessor: CoroutineAIProcessor,
    private val stateManager: StateManager,
    private val resourceManager: ResourceManager
) : ViewModel() {
    
    override fun onCleared() {
        super.onCleared()
        resourceManager.releaseResources()
    }
}
```

## Conclusion

A well-structured architecture for AI-powered Android apps should:
- Separate concerns between AI processing and UI
- Handle resource management efficiently
- Implement proper error handling
- Use coroutines for asynchronous operations
- Maintain clean and testable code

Key takeaways:
1. Use MVVM with Clean Architecture for maintainable code
2. Implement proper resource management for AI models
3. Use coroutines for efficient background processing
4. Handle state management properly
5. Consider memory and battery optimization

Next chapter will cover UI/UX design patterns specific to AI-powered utility apps.
