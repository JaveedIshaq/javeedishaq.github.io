# Chapter 4: AI Frameworks for Android

## 4.1 TensorFlow Lite

### Setup and Configuration

#### 1. Gradle Dependencies
```gradle
dependencies {
    // TensorFlow Lite
    implementation 'org.tensorflow:tensorflow-lite:2.9.0'
    implementation 'org.tensorflow:tensorflow-lite-support:0.4.2'
    implementation 'org.tensorflow:tensorflow-lite-metadata:0.4.2'
    
    // Optional: GPU delegation
    implementation 'org.tensorflow:tensorflow-lite-gpu:2.9.0'
    
    // Optional: Metal delegation for newer Android devices
    implementation 'org.tensorflow:tensorflow-lite-metal:2.9.0'
}
```

#### 2. Basic Model Implementation
```kotlin
class TFLiteClassifier(private val context: Context) {
    private var interpreter: Interpreter? = null
    private var modelBuffer: ByteBuffer? = null
    
    init {
        loadModel()
    }
    
    private fun loadModel() {
        val model = FileUtil.loadMappedFile(context, "model.tflite")
        val options = Interpreter.Options().apply {
            setNumThreads(4)
            setUseNNAPI(true) // Enable Neural Network API
        }
        interpreter = Interpreter(model, options)
    }
    
    fun classify(inputArray: FloatArray): FloatArray {
        val outputArray = FloatArray(1000) // Adjust size based on your model
        interpreter?.run(inputArray, outputArray)
        return outputArray
    }
}
```

### Model Conversion

#### 1. Converting from Keras
```python
import tensorflow as tf

# Convert the model
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the model
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

#### 2. Quantization
```python
# Post-training quantization
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]

# Representative dataset for quantization
def representative_dataset():
    for data in tf.data.Dataset.from_tensor_slices(train_images).batch(1).take(100):
        yield [data]

converter.representative_dataset = representative_dataset
```

### Integration Best Practices

#### 1. Asynchronous Processing
```kotlin
class MLProcessor {
    private val scope = CoroutineScope(Dispatchers.Default + Job())
    
    fun processImage(bitmap: Bitmap, onResult: (Result<List<Detection>>) -> Unit) {
        scope.launch {
            try {
                val result = withContext(Dispatchers.Default) {
                    // Process image using TFLite
                    classifier.detect(bitmap)
                }
                onResult(Result.success(result))
            } catch (e: Exception) {
                onResult(Result.failure(e))
            }
        }
    }
}
```

#### 2. Memory Management
```kotlin
class ModelManager {
    private var interpreter: Interpreter? = null
    
    fun initializeModel() {
        // Load model when needed
    }
    
    fun releaseResources() {
        interpreter?.close()
        interpreter = null
    }
}
```

## 4.2 Google ML Kit

### Available Features

#### 1. Text Recognition Setup
```kotlin
dependencies {
    implementation 'com.google.mlkit:text-recognition:16.0.0'
}

class TextRecognizer {
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
    
    fun recognizeText(image: InputImage, onSuccess: (Text) -> Unit, onError: (Exception) -> Unit) {
        recognizer.process(image)
            .addOnSuccessListener(onSuccess)
            .addOnFailureListener(onError)
    }
}
```

#### 2. Face Detection Implementation
```kotlin
class FaceDetector {
    private val detector = FaceDetection.getClient(
        FaceDetectionOptions.Builder()
            .setPerformanceMode(FaceDetectionOptions.PERFORMANCE_MODE_ACCURATE)
            .setLandmarkMode(FaceDetectionOptions.LANDMARK_MODE_ALL)
            .setClassificationMode(FaceDetectionOptions.CLASSIFICATION_MODE_ALL)
            .build()
    )
    
    fun detectFaces(image: InputImage): Task<List<Face>> {
        return detector.process(image)
    }
}
```

### Best Practices

#### 1. Error Handling
```kotlin
class MLKitProcessor {
    fun processWithMLKit(
        image: InputImage,
        onSuccess: (Result) -> Unit,
        onError: (Exception) -> Unit
    ) {
        try {
            // Process with ML Kit
            detector.process(image)
                .addOnSuccessListener { results ->
                    if (results.isEmpty()) {
                        onError(NoResultsException())
                    } else {
                        onSuccess(results)
                    }
                }
                .addOnFailureListener { e ->
                    onError(e)
                }
        } catch (e: Exception) {
            onError(e)
        }
    }
}
```

## 4.3 MediaPipe

### Setup Process
```gradle
dependencies {
    implementation 'com.google.mediapipe:solution-core:latest.release'
    implementation 'com.google.mediapipe:hands:latest.release'
    implementation 'com.google.mediapipe:face-detection:latest.release'
}
```

### Implementation Example
```kotlin
class HandTracker {
    private val hands = Hands(
        context,
        HandsOptions.builder()
            .setStaticImageMode(false)
            .setMaxNumHands(2)
            .setMinDetectionConfidence(0.5f)
            .setMinTrackingConfidence(0.5f)
            .build()
    )
    
    init {
        hands.setErrorListener { message, _ -> Log.e("MediaPipe", "Error: $message") }
        hands.setResultListener { results ->
            // Process hand tracking results
        }
    }
}
```

## 4.4 PyTorch Mobile

### Setup and Configuration
```gradle
dependencies {
    implementation 'org.pytorch:pytorch_android:1.12.2'
    implementation 'org.pytorch:pytorch_android_torchvision:1.12.2'
}
```

### Model Deployment
```kotlin
class PyTorchClassifier {
    private var module: Module? = null
    
    init {
        loadModel()
    }
    
    private fun loadModel() {
        module = Module.load(assetFilePath(context, "model.pt"))
    }
    
    fun classify(bitmap: Bitmap): List<Result> {
        // Preprocess image
        val inputTensor = TensorImageUtils.bitmapToFloat32Tensor(
            bitmap,
            TensorImageUtils.TORCHVISION_NORM_MEAN_RGB,
            TensorImageUtils.TORCHVISION_NORM_STD_RGB
        )
        
        // Forward pass
        val outputTensor = module?.forward(IValue.from(inputTensor))?.toTensor()
        
        // Process results
        return processOutputTensor(outputTensor)
    }
}
```

## Performance Optimization

### 1. Model Optimization
```kotlin
class ModelOptimizer {
    fun optimizeModel(context: Context) {
        val options = Interpreter.Options().apply {
            setNumThreads(Runtime.getRuntime().availableProcessors())
            setUseNNAPI(true)
            
            // GPU Delegation
            if (CompatibilityList().isDelegateSupportedOnThisDevice) {
                val delegateOptions = GpuDelegateOptions.Builder()
                    .setPrecisionLossAllowed(true)
                    .setQuantizedModelsAllowed(true)
                    .build()
                addDelegate(GpuDelegate(delegateOptions))
            }
        }
    }
}
```

### 2. Memory Management
```kotlin
class ResourceManager {
    private var resources: MutableList<Closeable> = mutableListOf()
    
    fun addResource(resource: Closeable) {
        resources.add(resource)
    }
    
    fun releaseResources() {
        resources.forEach { resource ->
            try {
                resource.close()
            } catch (e: Exception) {
                Log.e("ResourceManager", "Error closing resource", e)
            }
        }
        resources.clear()
    }
}
```

## Conclusion

When choosing an AI framework for your Android utility app, consider:
- TensorFlow Lite for general ML tasks and custom models
- ML Kit for ready-to-use solutions
- MediaPipe for real-time processing
- PyTorch Mobile for PyTorch model deployment

Key considerations:
1. Performance requirements
2. Model size and complexity
3. Development timeline
4. Required features
5. Device compatibility

Next chapter will cover architecture and design patterns for AI-powered utility apps.
