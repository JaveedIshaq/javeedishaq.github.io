# Lesson 7: Navigation in Android vs Flutter

## Overview

Navigation is fundamental to mobile app development. Coming from Flutter's Navigator, you'll find Android's Navigation Component provides similar capabilities with more structure and type safety. This lesson compares navigation approaches and shows how to implement common navigation patterns.

## Navigation Systems Comparison

| Feature | Flutter | Android (Compose Navigation) |
|---------|---------|-----------------------------|
| Route Definition | Routes map/onGenerateRoute | NavHost with composables |
| Type Safety | No (string-based) | Yes (with destinations) |
| Arguments | Dynamic typing | Type-safe with classes |
| Back Stack | Manual management | Automatic |
| Deep Links | Manual setup | Built-in support |
| Nested Navigation | Navigator widgets | Nested NavHosts |
| Animations | Route transitions | Enter/Exit transitions |

## Basic Navigation

### Android: Jetpack Navigation

```kotlin
// Navigation graph (res/navigation/nav_graph.xml)
<nav xmlns:android="http://schemas.android.com/apk/res/android">
    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.app.HomeFragment"
        android:label="Home"
        tools:layout="@layout/fragment_home" >
        <action
            android:id="@+id/action_home_to_details"
            app:destination="@id/detailsFragment" />
    </fragment>
    <fragment
        android:id="@+id/detailsFragment"
        android:name="com.example.app.DetailsFragment"
        android:label="Details"
        tools:layout="@layout/fragment_details" />
</nav>

// Fragment navigation (Kotlin)
binding.buttonNavigate.setOnClickListener {
    findNavController().navigate(R.id.action_home_to_details)
}
```

### Flutter: Navigator

```dart
// Routes
type: PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => DetailsScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          }),
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/details': (context) => DetailsScreen(),
      },
    );
  }
}

// Navigate between routes
ElevatedButton(
  onPressed: () {
    Navigator.pushNamed(context, '/details');
  },
  child: Text('Go to Details'),
)
```

## Passing Arguments

### Android

```kotlin
// Passing arguments with Safe Args
val action = HomeFragmentDirections.actionHomeToDetails(itemId)
findNavController().navigate(action)

// Receiving arguments
class DetailsFragment : Fragment() {
    private val args: DetailsFragmentArgs by navArgs()
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val itemId = args.itemId
    }
}
```

### Flutter

```dart
// Passing arguments
Navigator.pushNamed(
  context,
  '/details',
  arguments: {'id': itemId},
);

// Receiving arguments
class DetailsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as Map;
    final itemId = args['id'];
    return Scaffold(
      appBar: AppBar(),
      body: Center(child: Text('Item ID: $itemId')),
    );
  }
}
```

## Deep Links

### Android

```xml
<!-- AndroidManifest.xml -->
<activity
    android:name=".MainActivity" >
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="http"
            android:host="www.example.com"
            android:pathPrefix="/details" />
    </intent-filter>
</activity>
```

### Flutter

```dart
// Handling deep link
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      onGenerateRoute: (settings) {
        if (settings.name == '/details') {
          final id = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => DetailsScreen(id: id),
          );
        }
        return null;
      },
    );
  }
}
```

## Nested Navigation

### Android

```kotlin
// Nested navigation setup
navGraphBuilder.navigation(
    startDestination = "home",
    route = "homeGraph"
) {
    composable("home") { HomeScreen() }
    composable("profile") { ProfileScreen() }
}

// Navigate between nested destinations
findNavController().navigate("homeGraph/home", args)
```

### Flutter

```dart
// Navigator 2.0 with nested navigation
child: Builder(
    builder: (BuildContext context) {
      return Navigator(
        key: nestedNavKey,
        initialRoute: 'home',
        onGenerateRoute: (RouteSettings settings) {
          switch (settings.name) {
            case 'home':
              return MaterialPageRoute(builder: (_) => HomeScreen());
            case 'profile':
              return MaterialPageRoute(builder: (_) => ProfileScreen());
          }
        },
      );
    },
  ),
```

## Navigation with Animations

### Android

```kotlin
// Custom animations
val options = NavOptions.Builder()
    .setEnterAnim(R.anim.fade_in)
    .setExitAnim(R.anim.fade_out)
    .setPopEnterAnim(R.anim.slide_in_left)
    .setPopExitAnim(R.anim.slide_out_right)
    .build()
findNavController().navigate(R.id.detailsFragment, null, options)
```

### Flutter

```dart
// Custom animations with PageRouteBuilder
Navigator.of(context).push(
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => DetailsScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  ),
);
```

## Best Practices

1. **Use Named Routes for Better Maintenance**
   - Instead of anonymous routes, use names that are descriptive
2. **Leverage Navigation Graphs in Android**
   - Manage all navigation routes in one place
3. **Use Safe Args for Type Safety in Android**
   - Avoid manual bundle management
4. **Utilize Navigator 2.0 in Flutter for Complex Scenarios**
   - Offers more flexible navigation control
5. **Handle Back Stack with Care**
   - Be mindful of users’ natural back navigation expectations

## Testing Navigation

### Android

```kotlin
// UI test for navigation
@Test
fun testNavigationToDetails() {
    val navController = TestNavHostController(ApplicationProvider.getApplicationContext())
    
    launchFragmentInHiltContainerunction HomeFragment::class.java) {
        // Set the NavController property on the fragment
        Navigation.setViewNavController(requireView(), navController)
    }
    
    assertEquals(navController.currentDestination?.id, R.id.homeFragment)
    onView(withId(R.id.buttonNavigate)).perform(click())
    assertEquals(navController.currentDestination?.id, R.id.detailsFragment)
}
```

### Flutter

```dart
// Testing navigation with flutter_test
group('Navigation Tests', () {
  testWidgets('Navigate to details', (tester) async {
    await tester.pumpWidget(MyApp());
    expect(find.text('Home'), findsOneWidget);
    await tester.tap(find.text('Go to Details'));
    await tester.pumpAndSettle();
    expect(find.text('Details Screen'), findsOneWidget);
  });
});
```

## Summary

Key similarities:
- Both platforms support deep links and nested navigation.
- Animation support for transitions.

Key differences:
- Android has a more structured navigation system with graphs and safe args.
- Flutter has a more flexible but less type-safe approach.

Tips:
- Choose navigation strategies based on app complexity.
- Use animations to enhance user experience.
- Always test different navigation paths, including edge cases.

---

Previous: [Lesson 6: State Management](./lesson-6-state-management.md) | Next: [Lesson 8: Networking with Retrofit](./lesson-8-networking-with-retrofit.md)
