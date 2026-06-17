# Chapter 3: Development Environment Setup

## Android Studio Configuration

### 1. Installation and Setup
- **Download and Install**
  - Latest stable version from developer.android.com
  - Required disk space: 8GB minimum
  - RAM requirement: 8GB minimum (16GB recommended)
  - CPU: Intel i5/AMD equivalent or better

- **Initial Configuration**
  ```bash
  # Recommended settings
  - Memory heap: 2048MB minimum
  - Enable Gradle daemon
  - Enable parallel project sync
  ```

### 2. Essential Plugins
- **Required Plugins**
  - Kotlin
  - Android SDK Tools
  - Android SDK Platform-Tools
  - Android Emulator

- **Recommended Plugins**
  - TensorFlow Lite Support
  - ML Model binding
  - Database Navigator
  - Android WiFi ADB

## SDK Tools Setup

### 1. Android SDK
```bash
# Minimum requirements
- Android SDK Platform 33 (Android 13)
- Android SDK Build-Tools 33.0.0
- Android SDK Platform-Tools
- Android Emulator
- Android SDK Tools
```

### 2. Build Tools
- Gradle configuration
- ProGuard setup
- R8 optimization
- Bundle tool
- APK Analyzer

## AI Development Tools

### 1. TensorFlow Lite Setup
```gradle
dependencies {
    implementation 'org.tensorflow:tensorflow-lite:2.9.0'
    implementation 'org.tensorflow:tensorflow-lite-support:0.4.2'
    implementation 'org.tensorflow:tensorflow-lite-metadata:0.4.2'
}
```

### 2. ML Kit Configuration
```gradle
dependencies {
    implementation 'com.google.mlkit:vision-common:17.3.0'
    implementation 'com.google.mlkit:text-recognition:16.0.0'
    implementation 'com.google.mlkit:face-detection:16.1.5'
}
```

### 3. MediaPipe Setup
```gradle
dependencies {
    implementation 'com.google.mediapipe:solution-core:latest.release'
    implementation 'com.google.mediapipe:hands:latest.release'
}
```

## Version Control Setup

### 1. Git Configuration
```bash
# Initial setup
git init
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# .gitignore setup
/build
*.iml
.gradle
/local.properties
/.idea
.DS_Store
/captures
.externalNativeBuild
```

### 2. GitHub Integration
- Repository setup
- Branch strategy
- CI/CD configuration
- Release management

## Project Structure

### 1. Directory Organization
```
app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/app/
│   │   │       ├── data/
│   │   │       ├── domain/
│   │   │       ├── presentation/
│   │   │       └── utils/
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   ├── test/
│   └── androidTest/
├── build.gradle
└── proguard-rules.pro
```

### 2. Module Setup
- Core module
- Feature modules
- AI module
- Common utilities

## Testing Environment

### 1. Local Testing
- JUnit setup
- Mockito configuration
- Espresso for UI testing
- Robot Pattern implementation

### 2. Device Testing
- Physical devices
- Emulator configuration
- Firebase Test Lab setup
- Performance testing tools

## Performance Monitoring

### 1. Android Profiler
- CPU Profiler
- Memory Profiler
- Network Profiler
- Energy Profiler

### 2. Custom Analytics
```kotlin
// Example Analytics Setup
implementation 'com.google.firebase:firebase-analytics-ktx:21.2.0'
implementation 'com.google.firebase:firebase-crashlytics-ktx:18.3.5'
```

## Security Configuration

### 1. Code Signing
```gradle
android {
    signingConfigs {
        release {
            storeFile file("keystore.jks")
            storePassword "****"
            keyAlias "key0"
            keyPassword "****"
        }
    }
}
```

### 2. ProGuard Rules
```proguard
-keepattributes *Annotation*
-keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
```

## Continuous Integration

### 1. GitHub Actions
```yaml
name: Android CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: set up JDK 11
      uses: actions/setup-java@v2
      with:
        java-version: '11'
        distribution: 'adopt'
    - name: Build with Gradle
      run: ./gradlew build
```

### 2. Firebase App Distribution
- Beta testing setup
- Distribution groups
- Release notes
- Version tracking

## Development Best Practices

### 1. Code Style
- Kotlin style guide
- Android style guide
- Custom lint rules
- Code formatting

### 2. Documentation
- KDoc comments
- README maintenance
- Architecture documentation
- API documentation

## Conclusion

A well-configured development environment is crucial for efficient AI-powered utility app development. Key takeaways:
- Proper tool configuration saves development time
- Consistent project structure improves maintainability
- Automated testing ensures reliability
- Security configuration protects user data
- CI/CD pipeline streamlines deployment

Next chapter will dive into AI frameworks for Android in detail.
