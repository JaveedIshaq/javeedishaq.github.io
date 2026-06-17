# Appendix C: Troubleshooting Guide

## 1. Common Issues

### Memory Management
```kotlin
/**
 * Common memory-related issues and solutions
 */
object MemoryTroubleshooting {
    /**
     * Problem: OutOfMemoryError during model inference
     * Solution: Implement proper memory management
     */
    class MemoryOptimizer {
        fun optimizeMemoryUsage() {
            // 1. Monitor memory usage
            val runtime = Runtime.getRuntime()
            val usedMemory = runtime.totalMemory() - runtime.freeMemory()
            val maxMemory = runtime.maxMemory()
            
            // 2. Implement memory thresholds
            if (usedMemory > maxMemory * 0.75) {
                // Clear caches
                clearMemoryCaches()
                // Force garbage collection
                runtime.gc()
            }
        }
        
        private fun clearMemoryCaches() {
            // Clear bitmap caches
            imageCache.evictAll()
            // Clear model caches
            modelCache.clear()
            // Clear temporary files
            clearTempFiles()
        }
    }
    
    /**
     * Problem: Memory leaks in ML operations
     * Solution: Proper resource cleanup
     */
    class ResourceManager {
        private var interpreter: Interpreter? = null
        private var modelBuffer: MappedByteBuffer? = null
        
        fun cleanup() {
            try {
                // Close interpreter
                interpreter?.close()
                interpreter = null
                
                // Release model buffer
                modelBuffer = null
                
                // Clear references
                System.gc()
            } catch (e: Exception) {
                Timber.e(e, "Error cleaning up resources")
            }
        }
    }
}
```

### Model Loading
```kotlin
/**
 * Common model loading issues and solutions
 */
object ModelTroubleshooting {
    /**
     * Problem: Model fails to load
     * Solution: Implement robust model loading with fallbacks
     */
    class ModelLoader {
        suspend fun loadModelSafely(
            context: Context,
            modelConfig: ModelConfig
        ): Result<Interpreter> = withContext(Dispatchers.IO) {
            try {
                // 1. Check if model exists
                if (!modelExists(context, modelConfig.modelName)) {
                    return@withContext Result.failure(
                        ModelNotFoundException("Model ${modelConfig.modelName} not found")
                    )
                }
                
                // 2. Verify model integrity
                if (!verifyModelIntegrity(context, modelConfig)) {
                    return@withContext Result.failure(
                        ModelCorruptedException("Model integrity check failed")
                    )
                }
                
                // 3. Load model with fallback options
                val options = InterpreterOptions()
                    .setUseNNAPI(true)
                    .setAllowFp16PrecisionForFp32(true)
                
                val interpreter = try {
                    // Try NNAPI first
                    loadModelWithOptions(context, modelConfig, options)
                } catch (e: Exception) {
                    // Fallback to CPU
                    options.useNNAPI = false
                    loadModelWithOptions(context, modelConfig, options)
                }
                
                Result.success(interpreter)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
        
        private fun verifyModelIntegrity(
            context: Context,
            modelConfig: ModelConfig
        ): Boolean {
            return try {
                // Check model hash
                val expectedHash = modelConfig.hash
                val actualHash = calculateModelHash(context, modelConfig.modelName)
                expectedHash == actualHash
            } catch (e: Exception) {
                false
            }
        }
    }
}
```

### Performance Problems
```kotlin
/**
 * Common performance issues and solutions
 */
object PerformanceTroubleshooting {
    /**
     * Problem: Slow inference time
     * Solution: Implement performance optimization strategies
     */
    class PerformanceOptimizer {
        fun optimizeInference() {
            // 1. Model optimization
            val optimizedModel = ModelOptimizer.optimize(
                model = originalModel,
                optimizations = listOf(
                    Optimization.QUANTIZATION,
                    Optimization.PRUNING,
                    Optimization.CLUSTERING
                )
            )
            
            // 2. Threading optimization
            val threadPool = Executors.newFixedThreadPool(
                Runtime.getRuntime().availableProcessors()
            )
            
            // 3. Batch processing
            class BatchProcessor {
                suspend fun processBatch(
                    inputs: List<Input>
                ): List<Output> = withContext(Dispatchers.Default) {
                    inputs.chunked(BATCH_SIZE).flatMap { batch ->
                        batch.map { input ->
                            async { processInput(input) }
                        }.awaitAll()
                    }
                }
            }
        }
        
        /**
         * Problem: UI freezes during inference
         * Solution: Implement proper threading
         */
        class ThreadingOptimizer {
            private val inferenceScope = CoroutineScope(
                Dispatchers.Default + SupervisorJob()
            )
            
            fun processWithoutBlocking(input: Input) {
                inferenceScope.launch {
                    try {
                        // Pre-process on IO thread
                        val preprocessed = withContext(Dispatchers.IO) {
                            preprocess(input)
                        }
                        
                        // Inference on Default thread
                        val result = withContext(Dispatchers.Default) {
                            runInference(preprocessed)
                        }
                        
                        // Update UI on Main thread
                        withContext(Dispatchers.Main) {
                            updateUI(result)
                        }
                    } catch (e: Exception) {
                        handleError(e)
                    }
                }
            }
        }
    }
}
```

### AI Model Issues
```kotlin
/**
 * Common AI model issues and solutions
 */
object ModelIssueTroubleshooting {
    /**
     * Problem: Poor model accuracy
     * Solution: Implement model validation and fallbacks
     */
    class ModelValidator {
        suspend fun validateModel(
            model: Model,
            testData: List<TestData>
        ): ValidationResult = withContext(Dispatchers.Default) {
            val results = testData.map { data ->
                async {
                    val prediction = model.predict(data.input)
                    val accuracy = calculateAccuracy(prediction, data.expected)
                    accuracy
                }
            }.awaitAll()
            
            val averageAccuracy = results.average()
            
            when {
                averageAccuracy < MINIMUM_ACCURACY -> {
                    // Fall back to backup model
                    switchToBackupModel()
                    ValidationResult.Failed(averageAccuracy)
                }
                averageAccuracy < WARN_ACCURACY -> {
                    // Log warning but continue
                    ValidationResult.Warning(averageAccuracy)
                }
                else -> {
                    ValidationResult.Success(averageAccuracy)
                }
            }
        }
    }
    
    /**
     * Problem: Inconsistent model behavior
     * Solution: Implement model versioning and updates
     */
    class ModelVersionManager {
        suspend fun checkAndUpdateModel() {
            val currentVersion = getCurrentModelVersion()
            val latestVersion = fetchLatestModelVersion()
            
            if (currentVersion < latestVersion) {
                try {
                    // Download new model
                    val newModel = downloadModel(latestVersion)
                    
                    // Validate new model
                    if (validateNewModel(newModel)) {
                        // Update model
                        updateModel(newModel)
                        // Update version
                        updateModelVersion(latestVersion)
                    } else {
                        // Log failure and keep current model
                        Timber.e("New model validation failed")
                    }
                } catch (e: Exception) {
                    Timber.e(e, "Model update failed")
                }
            }
        }
    }
}
```

## 2. Solutions Matrix

### Common Problems and Solutions
```kotlin
/**
 * Quick reference for common problems and solutions
 */
object TroubleshootingMatrix {
    val commonIssues = mapOf(
        "OutOfMemoryError" to Solution(
            description = "App crashes with OutOfMemoryError during inference",
            causes = listOf(
                "Large model size",
                "Memory leaks",
                "Inefficient resource management"
            ),
            solutions = listOf(
                "Implement memory optimization",
                "Use model quantization",
                "Clear unused resources",
                "Implement proper cleanup"
            ),
            codeExample = """
                class MemoryOptimizer {
                    fun optimize() {
                        // Clear caches
                        imageCache.evictAll()
                        // Release unused resources
                        cleanup()
                        // Force garbage collection
                        System.gc()
                    }
                }
            """
        ),
        
        "SlowInference" to Solution(
            description = "Model inference is too slow",
            causes = listOf(
                "Unoptimized model",
                "Inefficient threading",
                "Resource contention"
            ),
            solutions = listOf(
                "Quantize model",
                "Use NNAPI",
                "Implement batch processing",
                "Optimize threading"
            ),
            codeExample = """
                class InferenceOptimizer {
                    fun optimize() {
                        // Use NNAPI
                        options.useNNAPI = true
                        // Enable FP16
                        options.allowFp16PrecisionForFp32 = true
                        // Set thread count
                        options.numThreads = 4
                    }
                }
            """
        ),
        
        "ModelAccuracy" to Solution(
            description = "Poor model accuracy in production",
            causes = listOf(
                "Model overfitting",
                "Data distribution shift",
                "Incorrect preprocessing"
            ),
            solutions = listOf(
                "Implement validation",
                "Use fallback models",
                "Monitor accuracy metrics",
                "Regular model updates"
            ),
            codeExample = """
                class AccuracyMonitor {
                    fun monitor(predictions: List<Prediction>) {
                        val accuracy = calculateAccuracy(predictions)
                        if (accuracy < THRESHOLD) {
                            switchToFallbackModel()
                        }
                    }
                }
            """
        )
    )
}
```

## 3. Performance Optimization

### Performance Checklist
```kotlin
/**
 * Performance optimization checklist
 */
object PerformanceChecklist {
    val checks = listOf(
        PerformanceCheck(
            name = "Model Optimization",
            checks = listOf(
                "Model quantization implemented",
                "NNAPI enabled where supported",
                "Model pruning applied",
                "Batch processing implemented"
            )
        ),
        
        PerformanceCheck(
            name = "Memory Management",
            checks = listOf(
                "Memory monitoring implemented",
                "Resource cleanup properly handled",
                "Cache management implemented",
                "Memory leaks addressed"
            )
        ),
        
        PerformanceCheck(
            name = "Threading",
            checks = listOf(
                "Proper coroutine usage",
                "Background processing implemented",
                "UI thread not blocked",
                "Thread pool properly configured"
            )
        ),
        
        PerformanceCheck(
            name = "Resource Usage",
            checks = listOf(
                "Battery usage optimized",
                "CPU usage monitored",
                "Network usage optimized",
                "Storage usage optimized"
            )
        )
    )
}
```

## 4. Monitoring and Debugging

### Debug Tools
```kotlin
/**
 * Tools for monitoring and debugging AI operations
 */
object DebugTools {
    /**
     * Performance monitoring
     */
    class PerformanceMonitor {
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
                val duration = (data.endTime - data.startTime) / 1_000_000 // ms
                Timber.d("$name took $duration ms")
            }
        }
    }
    
    /**
     * Model debugging
     */
    class ModelDebugger {
        fun debugModel(
            input: Input,
            output: Output,
            expectedOutput: Output
        ) {
            // Log input shape and values
            Timber.d("Input shape: ${input.shape}")
            Timber.d("Input values: ${input.values.take(5)}")
            
            // Log output shape and values
            Timber.d("Output shape: ${output.shape}")
            Timber.d("Output values: ${output.values.take(5)}")
            
            // Compare with expected output
            val accuracy = calculateAccuracy(output, expectedOutput)
            Timber.d("Accuracy: $accuracy")
            
            // Log performance metrics
            logPerformanceMetrics()
        }
    }
}
```

This troubleshooting guide provides comprehensive solutions for common issues in AI-powered Android apps, focusing on:
- Memory management
- Model loading and performance
- Threading and UI responsiveness
- Model accuracy and validation
- Debugging and monitoring tools

Use these solutions as a reference when encountering issues in your AI-powered Android applications.
