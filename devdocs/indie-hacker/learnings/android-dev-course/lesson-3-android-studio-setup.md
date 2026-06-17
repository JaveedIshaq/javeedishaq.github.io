# Lesson 3: Android Studio Setup and First Project

## Overview

Android Studio is the official IDE for Android development. Coming from Flutter, you might have used it before, but this lesson focuses on the native Android development features and how to create a pure Android project with Jetpack Compose.

## Installing Android Studio

### System Requirements
- **macOS**: macOS 10.14 (Mojave) or higher
- **RAM**: 8 GB minimum, 16 GB recommended
- **Disk Space**: 8 GB minimum + space for Android SDK

### Installation Steps

1. Download Android Studio from [developer.android.com/studio](https://developer.android.com/studio)
2. Run the installer and follow the setup wizard
3. Install the Android SDK (latest stable version)
4. Install at least one system image for the emulator

## Android Studio vs VS Code (Flutter)

| Feature | VS Code (Flutter) | Android Studio |
|---------|------------------|----------------|
| Memory Usage | Lower | Higher |
| Android Features | Basic | Full support |
| UI Designer | Flutter Inspector | Layout Inspector + Compose Preview |
| Debugging | Good | Excellent |
| Refactoring | Basic | Advanced |
| Build Tools | External | Integrated |

## Creating Your First Android Project

### Step 1: New Project

1. Open Android Studio
2. Click "New Project"
3. Select "Empty Activity" template
4. Configure your project:

```
Name: MyFirstAndroidApp
Package name: com.example.myfirstandroidapp
Save location: Choose your directory
Language: Kotlin
Minimum SDK: API 24 (Android 7.0)
Build configuration language: Kotlin DSL (recommended)
```

### Step 2: Understanding Project Structure

```
MyFirstAndroidApp/
├── app/                          # Main application module
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/            # Kotlin code (despite the name)
│   │   │   │   └── com/example/myfirstandroidapp/
│   │   │   │       └── MainActivity.kt
│   │   │   ├── res/             # Resources
│   │   │   │   ├── drawable/    # Images
│   │   │   │   ├── layout/      # XML layouts (if not using Compose)
│   │   │   │   ├── values/      # Strings, colors, themes
│   │   │   │   └── mipmap/      # App icons
│   │   │   └── AndroidManifest.xml
│   │   └── test/                # Unit tests
│   └── build.gradle.kts         # Module build file
├── gradle/                      # Gradle wrapper
├── build.gradle.kts            # Project build file
└── settings.gradle.kts         # Project settings
```

### Flutter vs Android Project Structure

| Flutter | Android | Purpose |
|---------|---------|---------|
| lib/ | app/src/main/java/ | Source code |
| assets/ | app/src/main/res/ | Resources |
| pubspec.yaml | build.gradle.kts | Dependencies |
| main.dart | MainActivity.kt | Entry point |

## Your First Jetpack Compose App

Let's modify the default project to use Jetpack Compose:

### MainActivity.kt
```kotlin
package com.example.myfirstandroidapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.myfirstandroidapp.ui.theme.MyFirstAndroidAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyFirstAndroidAppTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Greeting("Android")
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Hello $name!",
            style = MaterialTheme.typography.headlineLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "You've clicked $count times",
            style = MaterialTheme.typography.bodyLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = { count++ }) {
            Text("Click me!")
        }
    }
}
```

### Comparing with Flutter

Here's the equivalent Flutter code:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Hello Flutter!',
              style: Theme.of(context).textTheme.headline4,
            ),
            SizedBox(height: 16),
            Text(
              'You\'ve clicked $_counter times',
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _counter++;
                });
              },
              child: Text('Click me!'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Key Differences

1. **Entry Point**: 
   - Flutter: `main()` function
   - Android: `MainActivity` class

2. **State Management**:
   - Flutter: `setState(() {})`
   - Compose: `remember { mutableStateOf() }`

3. **UI Building**:
   - Flutter: Widget tree
   - Compose: Composable functions

## Gradle Build System

### build.gradle.kts (app module)

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.myfirstandroidapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myfirstandroidapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Compose BOM - manages all Compose library versions
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    
    // Debug tooling
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

### Comparison: pubspec.yaml vs build.gradle.kts

| Flutter (pubspec.yaml) | Android (build.gradle.kts) |
|------------------------|----------------------------|
| `dependencies:` | `dependencies { }` |
| `flutter_bloc: ^8.0.0` | `implementation("androidx.compose.material3:material3")` |
| `flutter pub get` | Gradle sync (automatic) |

## Running Your App

### Using Emulator

1. Open AVD Manager (Tools → AVD Manager)
2. Create a new virtual device
3. Select a device definition (e.g., Pixel 7)
4. Select a system image (API 34 recommended)
5. Click the run button or press `Shift + F10`

### Using Physical Device

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect via USB
4. Select your device from the dropdown
5. Click run

### Hot Reload in Compose

Unlike Flutter's hot reload, Compose uses "Live Edit":

1. Enable it in settings: Android Studio → Preferences → Experimental
2. Check "Enable Live Edit"
3. Changes to Composables update instantly

## Android Studio Tips

### Essential Shortcuts

| Action | Shortcut (Mac) | Shortcut (Windows) |
|--------|----------------|-------------------|
| Run app | Shift + F10 | Shift + F10 |
| Debug app | Shift + F9 | Shift + F9 |
| Find class | Cmd + O | Ctrl + N |
| Find file | Cmd + Shift + O | Ctrl + Shift + N |
| Reformat code | Cmd + Option + L | Ctrl + Alt + L |
| Quick fix | Option + Enter | Alt + Enter |

### Useful Features

1. **Compose Preview**:
```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyFirstAndroidAppTheme {
        Greeting("Android")
    }
}
```

2. **Layout Inspector**: Tools → Layout Inspector (for debugging UI)

3. **Profiler**: View → Tool Windows → Profiler (for performance)

4. **Logcat**: View → Tool Windows → Logcat (for logs)

## Common Issues and Solutions

### Issue 1: Gradle Sync Failed
**Solution**: File → Invalidate Caches and Restart

### Issue 2: Emulator Won't Start
**Solution**: 
- Ensure virtualization is enabled in BIOS
- Try a different system image
- Allocate more RAM to emulator

### Issue 3: Compose Preview Not Working
**Solution**:
- Ensure you have the latest Compose version
- Add `@Preview` annotation
- Build → Rebuild Project

## Practice Exercise

Create a simple counter app with the following features:
1. Display a counter value
2. Increment button
3. Decrement button
4. Reset button
5. The counter should not go below 0

### Solution

```kotlin
@Composable
fun CounterApp() {
    var counter by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Counter: $counter",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = { if (counter > 0) counter-- },
                enabled = counter > 0
            ) {
                Text("-")
            }
            
            Button(onClick = { counter++ }) {
                Text("+")
            }
            
            Button(onClick = { counter = 0 }) {
                Text("Reset")
            }
        }
    }
}
```

## Summary

You've now:
- Set up Android Studio for native development
- Created your first Android project
- Understood the project structure
- Written your first Jetpack Compose UI
- Learned the basics of Gradle build system
- Run your app on emulator/device

Next lesson will dive deeper into Android components and lifecycle.

---

Previous: [Lesson 2: Kotlin Basics](./lesson-2-kotlin-basics.md) | Next: [Lesson 4: Android Components](./lesson-4-android-components.md)
