# Chapter 10: Testing and Quality Assurance

## Unit Testing

### 1. ViewModel Testing
```kotlin
@RunWith(MockitoJUnitRunner::class)
class ImageProcessingViewModelTest {
    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()
    
    @Mock
    private lateinit var imageProcessor: ImageProcessor
    
    @Mock
    private lateinit var modelManager: ModelManager
    
    private lateinit var viewModel: ImageProcessingViewModel
    
    private val testDispatcher = StandardTestDispatcher()
    
    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        viewModel = ImageProcessingViewModel(imageProcessor, modelManager)
    }
    
    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }
    
    @Test
    fun `processImage emits correct states when successful`() = runTest {
        // Given
        val testImage = createTestBitmap()
        val expectedResult = ProcessingResult(confidence = 0.95f)
        
        coEvery { imageProcessor.process(any()) } returns expectedResult
        
        // When
        viewModel.processImage(testImage)
        
        // Then
        val states = mutableListOf<ProcessingState>()
        val job = launch { viewModel.processingState.toList(states) }
        
        advanceUntilIdle()
        
        assertThat(states).containsExactly(
            ProcessingState.Idle,
            ProcessingState.Processing,
            ProcessingState.Success(expectedResult)
        )
        
        job.cancel()
    }
    
    @Test
    fun `processImage handles errors correctly`() = runTest {
        // Given
        val testImage = createTestBitmap()
        val testError = RuntimeException("Processing failed")
        
        coEvery { imageProcessor.process(any()) } throws testError
        
        // When
        viewModel.processImage(testImage)
        
        // Then
        val states = mutableListOf<ProcessingState>()
        val job = launch { viewModel.processingState.toList(states) }
        
        advanceUntilIdle()
        
        assertThat(states).containsExactly(
            ProcessingState.Idle,
            ProcessingState.Processing,
            ProcessingState.Error(testError.message)
        )
        
        job.cancel()
    }
}
```

### 2. Repository Testing
```kotlin
@RunWith(MockitoJUnitRunner::class)
class AIRepositoryTest {
    @Mock
    private lateinit var localDataSource: LocalDataSource
    
    @Mock
    private lateinit var aiProcessor: AIProcessor
    
    private lateinit var repository: AIRepository
    
    @Before
    fun setup() {
        repository = AIRepositoryImpl(localDataSource, aiProcessor)
    }
    
    @Test
    fun `processImage returns success result when processing succeeds`() = runTest {
        // Given
        val testInput = ProcessingInput(ByteArray(100))
        val expectedResult = ProcessingResult(confidence = 0.85f)
        
        coEvery { aiProcessor.process(any()) } returns expectedResult
        coEvery { localDataSource.saveResult(any()) } just Runs
        
        // When
        val result = repository.processImage(testInput)
        
        // Then
        assertThat(result).isEqualTo(expectedResult)
        coVerify { localDataSource.saveResult(expectedResult) }
    }
    
    @Test
    fun `getProcessedImages returns flow of results`() = runTest {
        // Given
        val testResults = listOf(
            ProcessingResult(confidence = 0.85f),
            ProcessingResult(confidence = 0.90f)
        )
        
        every { localDataSource.getAllResults() } returns flowOf(testResults)
        
        // When
        val results = repository.getProcessedImages().first()
        
        // Then
        assertThat(results).isEqualTo(testResults)
    }
}
```

## Integration Testing

### 1. End-to-End Flow Testing
```kotlin
@LargeTest
@RunWith(AndroidJUnit4::class)
class ImageProcessingFlowTest {
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)
    
    @Inject
    lateinit var imageProcessor: ImageProcessor
    
    @Inject
    lateinit var modelManager: ModelManager
    
    @Before
    fun setup() {
        hiltRule.inject()
    }
    
    @Test
    fun verifyImageProcessingFlow() {
        // Start flow
        onView(withId(R.id.selectImageButton))
            .perform(click())
        
        // Select image from gallery
        intending(hasAction(Intent.ACTION_PICK))
            .respondWith(createImageResult())
        
        // Verify processing state
        onView(withId(R.id.progressIndicator))
            .check(matches(isDisplayed()))
        
        // Wait for processing to complete
        Thread.sleep(2000) // Consider using IdlingResource instead
        
        // Verify results
        onView(withId(R.id.resultConfidence))
            .check(matches(withText(containsString("85%"))))
        
        onView(withId(R.id.resultLabel))
            .check(matches(isDisplayed()))
    }
    
    private fun createImageResult(): Instrumentation.ActivityResult {
        val resources = InstrumentationRegistry.getInstrumentation().context.resources
        val bitmap = BitmapFactory.decodeResource(resources, R.drawable.test_image)
        val uri = saveBitmapToFile(bitmap)
        
        return Instrumentation.ActivityResult(Activity.RESULT_OK, Intent().apply {
            setData(uri)
        })
    }
}
```

### 2. Component Integration Testing
```kotlin
@MediumTest
@RunWith(AndroidJUnit4::class)
class AIComponentIntegrationTest {
    @get:Rule
    val hiltRule = HiltAndroidRule(this)
    
    @Inject
    lateinit var modelManager: ModelManager
    
    @Inject
    lateinit var imageProcessor: ImageProcessor
    
    @Inject
    lateinit var repository: AIRepository
    
    @Before
    fun setup() {
        hiltRule.inject()
    }
    
    @Test
    fun verifyModelLoadingAndProcessing() = runTest {
        // Load model
        val model = modelManager.loadModel("test_model.tflite")
        assertThat(model).isNotNull()
        
        // Process image
        val testImage = createTestImage()
        val result = imageProcessor.process(testImage)
        assertThat(result.confidence).isGreaterThan(0.5f)
        
        // Save and retrieve result
        repository.saveResult(result)
        val savedResults = repository.getResults().first()
        assertThat(savedResults).contains(result)
    }
}
```

## AI Model Testing

### 1. Model Validation
```kotlin
class ModelValidationTest {
    private lateinit var modelValidator: ModelValidator
    private lateinit var testDataset: Dataset
    
    @Before
    fun setup() {
        modelValidator = ModelValidator()
        testDataset = loadTestDataset()
    }
    
    @Test
    fun `model meets accuracy requirements`() = runTest {
        // Given
        val model = loadTestModel()
        val minimumAccuracy = 0.85f
        
        // When
        val accuracy = modelValidator.validateAccuracy(model, testDataset)
        
        // Then
        assertThat(accuracy).isAtLeast(minimumAccuracy)
    }
    
    @Test
    fun `model performs within latency requirements`() = runTest {
        // Given
        val model = loadTestModel()
        val maxLatency = 100L // milliseconds
        
        // When
        val latency = modelValidator.measureLatency(model, testDataset)
        
        // Then
        assertThat(latency).isAtMost(maxLatency)
    }
    
    @Test
    fun `model size meets requirements`() {
        // Given
        val model = loadTestModel()
        val maxSize = 5 * 1024 * 1024 // 5MB
        
        // When
        val size = modelValidator.getModelSize(model)
        
        // Then
        assertThat(size).isAtMost(maxSize)
    }
}
```

### 2. Model Performance Testing
```kotlin
class ModelPerformanceTest {
    private lateinit var performanceTester: ModelPerformanceTester
    
    @Before
    fun setup() {
        performanceTester = ModelPerformanceTester()
    }
    
    @Test
    fun `model maintains performance under load`() = runTest {
        // Given
        val model = loadTestModel()
        val testCases = generateTestCases(1000)
        
        // When
        val results = performanceTester.runLoadTest(
            model = model,
            testCases = testCases,
            concurrentUsers = 10,
            durationSeconds = 60
        )
        
        // Then
        with(results) {
            assertThat(averageLatency).isAtMost(100.milliseconds)
            assertThat(p95Latency).isAtMost(200.milliseconds)
            assertThat(errorRate).isAtMost(0.01f)
            assertThat(throughput).isAtLeast(10.0)
        }
    }
    
    @Test
    fun `model handles different input sizes`() = runTest {
        // Given
        val model = loadTestModel()
        val inputSizes = listOf(224, 320, 416, 512)
        
        // When
        val results = inputSizes.map { size ->
            val input = createTestInput(size)
            performanceTester.measureProcessingTime(model, input)
        }
        
        // Then
        results.forEach { result ->
            assertThat(result.isSuccess).isTrue()
            assertThat(result.getOrNull()!!).isAtMost(200.milliseconds)
        }
    }
}
```

## Performance Testing

### 1. Memory Leak Detection
```kotlin
@RunWith(AndroidJUnit4::class)
class MemoryLeakTest {
    private lateinit var leakDetector: LeakDetector
    
    @Before
    fun setup() {
        leakDetector = LeakDetector()
    }
    
    @Test
    fun `no memory leaks during image processing`() = runTest {
        // Given
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        
        // When
        repeat(100) { // Simulate multiple image processing operations
            onView(withId(R.id.processButton)).perform(click())
            Thread.sleep(100)
        }
        
        // Then
        val leaks = leakDetector.findLeaks()
        assertThat(leaks).isEmpty()
        
        scenario.close()
    }
    
    @Test
    fun `model resources are properly released`() = runTest {
        // Given
        val modelManager = ModelManager()
        
        // When
        repeat(10) {
            val model = modelManager.loadModel("test_model.tflite")
            model.process(createTestInput())
            model.release()
        }
        
        // Then
        val memoryInfo = leakDetector.getMemoryInfo()
        assertThat(memoryInfo.usedMemory).isAtMost(initialMemory + 10.megabytes)
    }
}
```

### 2. Battery Consumption Testing
```kotlin
class BatteryConsumptionTest {
    private lateinit var batteryMonitor: BatteryMonitor
    
    @Before
    fun setup() {
        batteryMonitor = BatteryMonitor()
    }
    
    @Test
    fun `battery consumption within limits during processing`() = runTest {
        // Given
        val processor = ImageProcessor()
        val testImages = generateTestImages(100)
        val maxBatteryDrain = 2.0 // percentage
        
        // When
        val initialBattery = batteryMonitor.getBatteryLevel()
        
        testImages.forEach { image ->
            processor.process(image)
        }
        
        val finalBattery = batteryMonitor.getBatteryLevel()
        
        // Then
        val batteryDrain = initialBattery - finalBattery
        assertThat(batteryDrain).isAtMost(maxBatteryDrain)
    }
    
    @Test
    fun `background processing respects battery optimization`() = runTest {
        // Given
        val processor = ImageProcessor()
        val batteryOptimizer = BatteryOptimizer()
        
        // When
        val consumptionStats = batteryMonitor.measureConsumption {
            processor.processInBackground(
                images = generateTestImages(50),
                batteryOptimizer = batteryOptimizer
            )
        }
        
        // Then
        assertThat(consumptionStats.averagePowerDraw).isAtMost(100.milliamps)
        assertThat(consumptionStats.peakPowerDraw).isAtMost(200.milliamps)
    }
}
```

## Automated Testing Pipeline

### 1. CI/CD Configuration
```yaml
name: Android AI App CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up JDK
      uses: actions/setup-java@v2
      with:
        java-version: '11'
        distribution: 'adopt'
        
    - name: Run Unit Tests
      run: ./gradlew testDebugUnitTest
        
    - name: Run Instrumentation Tests
      uses: reactivecircus/android-emulator-runner@v2
      with:
        api-level: 29
        script: ./gradlew connectedCheck
        
    - name: Run Model Tests
      run: ./gradlew validateModels
        
    - name: Upload Test Results
      uses: actions/upload-artifact@v2
      with:
        name: test-results
        path: app/build/reports/tests/
```

### 2. Test Automation
```kotlin
class TestAutomation {
    @Test
    fun `run comprehensive test suite`() = runBlocking {
        val testSuite = TestSuite.Builder()
            .addUnitTests()
            .addIntegrationTests()
            .addModelTests()
            .addPerformanceTests()
            .build()
            
        val results = testSuite.runAll()
        
        generateTestReport(results)
        
        assertThat(results.failureRate).isAtMost(0.01f)
        assertThat(results.coverage).isAtLeast(0.80f)
    }
    
    private fun generateTestReport(results: TestResults) {
        TestReport.Builder()
            .addTestResults(results)
            .addCoverageReport()
            .addPerformanceMetrics()
            .addScreenshots()
            .build()
            .saveToFile("test-report.html")
    }
}
```

## Conclusion

Comprehensive testing of AI-powered Android apps requires:
1. Thorough unit testing of all components
2. Integration testing of AI features
3. Model validation and performance testing
4. Memory and battery consumption monitoring
5. Automated testing pipeline

Key takeaways:
- Implement comprehensive test coverage
- Validate AI model performance
- Monitor resource consumption
- Automate testing process
- Generate detailed reports

Next chapter will cover app monetization and distribution strategies.
