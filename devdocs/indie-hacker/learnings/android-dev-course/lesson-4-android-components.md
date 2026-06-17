# Lesson 4: Understanding Android Components and Lifecycle

## Overview

Android components are the essential building blocks of Android apps. Coming from Flutter, where everything is a Widget, Android has distinct component types with specific purposes and lifecycles. This lesson explains these components and how they compare to Flutter concepts.

## Android Components vs Flutter Concepts

| Android Component | Flutter Equivalent | Purpose |
|-------------------|-------------------|---------|
| Activity | MaterialApp/Screen | Single screen with UI |
| Fragment | Widget/Route | Reusable portion of UI |
| Service | Isolate/Background task | Long-running operations |
| Broadcast Receiver | Platform Channel listener | System-wide event handling |
| Content Provider | Shared Preferences/Database | Data sharing between apps |

## Activities

An Activity represents a single screen with a user interface. In modern Android development with Jetpack Compose, you typically use one Activity and handle navigation with Compose Navigation.

### Activity Lifecycle

```kotlin
class MainActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Called when activity is first created
        // Similar to initState() in Flutter
        setContent {
            MyApp()
        }
    }
    
    override fun onStart() {
        super.onStart()
        // Activity is visible to user
    }
    
    override fun onResume() {
        super.onResume()
        // Activity is in foreground and interactive
        // Similar to when Flutter app comes to foreground
    }
    
    override fun onPause() {
        super.onPause()
        // Activity is partially obscured
        // Save any unsaved data here
    }
    
    override fun onStop() {
        super.onStop()
        // Activity is no longer visible
        // Similar to when Flutter app goes to background
    }
    
    override fun onDestroy() {
        super.onDestroy()
        // Activity is being destroyed
        // Similar to dispose() in Flutter
    }
}
```

### Flutter Comparison

```dart
class MyScreen extends StatefulWidget {
  @override
  _MyScreenState createState() => _MyScreenState();
}

class _MyScreenState extends State<MyScreen> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    // Similar to onCreate
    WidgetsBinding.instance.addObserver(this);
  }
  
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        // Similar to onResume
        break;
      case AppLifecycleState.paused:
        // Similar to onPause
        break;
      case AppLifecycleState.detached:
        // Similar to onDestroy
        break;
    }
  }
  
  @override
  void dispose() {
    // Similar to onDestroy
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
}
```

## Modern Single Activity Architecture

In modern Android development, especially with Jetpack Compose, we use a single Activity pattern:

```kotlin
@AndroidEntryPoint  // If using Hilt for DI
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAppTheme {
                val navController = rememberNavController()
                NavHost(
                    navController = navController,
                    startDestination = "home"
                ) {
                    composable("home") { HomeScreen(navController) }
                    composable("details/{id}") { backStackEntry ->
                        DetailsScreen(
                            navController,
                            backStackEntry.arguments?.getString("id") ?: ""
                        )
                    }
                }
            }
        }
    }
}
```

## Services

Services run in the background to perform long-running operations. Unlike Flutter's Isolates, Android Services are system-managed components.

### Types of Services

1. **Foreground Service**: Shows a notification, continues running even when app is in background
2. **Background Service**: No UI, system can kill it if memory is needed
3. **Bound Service**: Provides client-server interface

### Example: Music Player Service

```kotlin
class MusicService : Service() {
    private val binder = MusicBinder()
    private var mediaPlayer: MediaPlayer? = null
    
    inner class MusicBinder : Binder() {
        fun getService(): MusicService = this@MusicService
    }
    
    override fun onBind(intent: Intent): IBinder = binder
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Handle the intent
        when (intent?.action) {
            "PLAY" -> playMusic()
            "PAUSE" -> pauseMusic()
            "STOP" -> stopMusic()
        }
        
        return START_STICKY  // Service will be restarted if killed
    }
    
    private fun playMusic() {
        // Create notification for foreground service
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Playing Music")
            .setContentText("Song Name")
            .setSmallIcon(R.drawable.ic_music)
            .build()
            
        startForeground(1, notification)
        
        mediaPlayer?.start()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.release()
    }
}
```

### Flutter Equivalent

```dart
// Using flutter_background_service package
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeService();
  runApp(MyApp());
}

Future<void> initializeService() async {
  final service = FlutterBackgroundService();
  
  await service.configure(
    androidConfiguration: AndroidConfiguration(
      onStart: onStart,
      autoStart: true,
      isForegroundMode: true,
    ),
    iosConfiguration: IosConfiguration(),
  );
}

@pragma('vm:entry-point')
void onStart(ServiceInstance service) async {
  // Background task logic
  if (service is AndroidServiceInstance) {
    service.setAsForegroundService();
    service.setForegroundNotificationInfo(
      title: "Playing Music",
      content: "Song Name",
    );
  }
}
```

## Broadcast Receivers

Broadcast Receivers respond to system-wide broadcast announcements. They're like global event listeners.

### Example: Battery Level Monitor

```kotlin
class BatteryReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BATTERY_LOW -> {
                // Handle low battery
                Toast.makeText(context, "Battery is low!", Toast.LENGTH_SHORT).show()
            }
            Intent.ACTION_POWER_CONNECTED -> {
                // Handle power connected
                Toast.makeText(context, "Charging started", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

// Register in Activity or Fragment
class MainActivity : ComponentActivity() {
    private val batteryReceiver = BatteryReceiver()
    
    override fun onResume() {
        super.onResume()
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_BATTERY_LOW)
            addAction(Intent.ACTION_POWER_CONNECTED)
        }
        registerReceiver(batteryReceiver, filter)
    }
    
    override fun onPause() {
        super.onPause()
        unregisterReceiver(batteryReceiver)
    }
}
```

### Flutter Equivalent

```dart
// Using platform channels
class BatteryMonitor {
  static const platform = MethodChannel('com.example.app/battery');
  
  Stream<String> get batteryStateStream {
    return EventChannel('com.example.app/battery_events')
        .receiveBroadcastStream()
        .cast<String>();
  }
  
  void listenToBatteryChanges() {
    batteryStateStream.listen((event) {
      if (event == 'low') {
        // Handle low battery
      } else if (event == 'connected') {
        // Handle charging
      }
    });
  }
}
```

## Content Providers

Content Providers manage access to structured data. They're rarely used in modern apps unless sharing data with other apps.

### Example: Accessing Contacts

```kotlin
@Composable
fun ContactsList() {
    val context = LocalContext.current
    var contacts by remember { mutableStateOf<List<Contact>>(emptyList()) }
    
    LaunchedEffect(Unit) {
        withContext(Dispatchers.IO) {
            contacts = loadContacts(context)
        }
    }
    
    LazyColumn {
        items(contacts) { contact ->
            Text(text = "${contact.name}: ${contact.phone}")
        }
    }
}

data class Contact(val name: String, val phone: String)

suspend fun loadContacts(context: Context): List<Contact> {
    val contactsList = mutableListOf<Contact>()
    
    val cursor = context.contentResolver.query(
        ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
        null, null, null, null
    )
    
    cursor?.use {
        val nameIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
        val phoneIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
        
        while (it.moveToNext()) {
            val name = it.getString(nameIndex)
            val phone = it.getString(phoneIndex)
            contactsList.add(Contact(name, phone))
        }
    }
    
    return contactsList
}
```

## AndroidManifest.xml

The manifest file declares all components and permissions. Flutter hides most of this, but in Android, you need to understand it.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">
    
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    
    <application
        android:name=".MyApplication"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.MyApp">
        
        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MyApp">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Service -->
        <service
            android:name=".MusicService"
            android:exported="false"
            android:foregroundServiceType="mediaPlayback" />
        
        <!-- Broadcast Receiver -->
        <receiver
            android:name=".BatteryReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BATTERY_LOW" />
                <action android:name="android.intent.action.POWER_CONNECTED" />
            </intent-filter>
        </receiver>
        
    </application>
</manifest>
```

## Application Class

The Application class maintains global application state. It's created before any other component.

```kotlin
@HiltAndroidApp  // If using Hilt
class MyApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        // Initialize libraries, analytics, crash reporting
        initializeTimber()
        initializeAnalytics()
    }
    
    private fun initializeTimber() {
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
    }
    
    private fun initializeAnalytics() {
        // Initialize Firebase, Crashlytics, etc.
    }
}
```

### Flutter Equivalent

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  await Firebase.initializeApp();
  
  // Set up error handling
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;
  
  runApp(MyApp());
}
```

## Practical Example: Todo App with Components

Let's build a simple Todo app that demonstrates these components:

```kotlin
// MainActivity.kt
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Start reminder service
        startService(Intent(this, ReminderService::class.java))
        
        setContent {
            TodoApp()
        }
    }
}

// ReminderService.kt
class ReminderService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private val checkInterval = 60_000L // 1 minute
    
    override fun onBind(intent: Intent?): IBinder? = null
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        scheduleReminders()
        return START_STICKY
    }
    
    private fun scheduleReminders() {
        handler.postDelayed({
            checkForDueTasks()
            scheduleReminders() // Reschedule
        }, checkInterval)
    }
    
    private fun checkForDueTasks() {
        // Check database for due tasks
        // Send notification if found
    }
}

// TodoScreen.kt
@Composable
fun TodoScreen(viewModel: TodoViewModel = hiltViewModel()) {
    val todos by viewModel.todos.collectAsState()
    
    Column {
        TodoList(todos = todos)
        AddTodoButton(onClick = { viewModel.addTodo() })
    }
}

// AlarmReceiver.kt
class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val todoId = intent.getIntExtra("todo_id", -1)
        if (todoId != -1) {
            showNotification(context, todoId)
        }
    }
    
    private fun showNotification(context: Context, todoId: Int) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        val notification = NotificationCompat.Builder(context, "todo_channel")
            .setContentTitle("Todo Reminder")
            .setContentText("Don't forget your task!")
            .setSmallIcon(R.drawable.ic_notification)
            .build()
            
        notificationManager.notify(todoId, notification)
    }
}
```

## Best Practices

1. **Use Single Activity Architecture** with Compose Navigation
2. **Minimize Service Usage** - only for truly background tasks
3. **Register Receivers Dynamically** when possible (in code, not manifest)
4. **Handle Configuration Changes** properly (rotation, etc.)
5. **Test Lifecycle Events** thoroughly

## Common Pitfalls from Flutter

1. **Memory Leaks**: Android components have complex lifecycles
   - Always unregister listeners
   - Use lifecycle-aware components

2. **Background Restrictions**: Android restricts background work
   - Use WorkManager for deferred tasks
   - Foreground services for immediate tasks

3. **Permission Handling**: More complex than Flutter
   - Runtime permissions for dangerous permissions
   - Declare all permissions in manifest

## Summary

Understanding Android components is crucial for native development:
- **Activities** are screens (use single Activity pattern)
- **Services** handle background tasks
- **Broadcast Receivers** listen for system events
- **Content Providers** share data between apps
- **Application** class for global initialization

Coming from Flutter, the component system might seem complex, but modern Android development with Compose simplifies much of this by using a single Activity and handling most UI with Composables.

---

Previous: [Lesson 3: Android Studio Setup](./lesson-3-android-studio-setup.md) | Next: [Lesson 5: Jetpack Compose Fundamentals](./lesson-5-jetpack-compose-fundamentals.md)
