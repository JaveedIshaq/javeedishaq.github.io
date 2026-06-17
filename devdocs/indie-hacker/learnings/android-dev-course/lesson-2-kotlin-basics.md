# Lesson 2: Kotlin Basics for Flutter Developers

## Overview

Coming from Dart to Kotlin will feel familiar in many ways. Both languages are modern, support null safety, and have similar syntax patterns. This lesson covers Kotlin fundamentals with direct comparisons to Dart concepts you already know.

## Variables and Constants

### Dart (Flutter)
```dart
// Variables
String name = "John";
var age = 25;
dynamic anything = "Can be anything";

// Constants
final String city = "New York";
const double pi = 3.14159;
```

### Kotlin
```kotlin
// Variables
var name: String = "John"
var age = 25  // Type inference
var anything: Any = "Can be anything"

// Constants
val city: String = "New York"  // Similar to final
const val PI = 3.14159  // Compile-time constant
```

**Key Differences:**
- Kotlin uses `var` for mutable and `val` for immutable variables
- `const val` in Kotlin is for compile-time constants (like `const` in Dart)
- Type inference works similarly in both languages

## Functions

### Dart (Flutter)
```dart
// Basic function
String greet(String name) {
  return "Hello, $name!";
}

// Arrow function
String greetShort(String name) => "Hello, $name!";

// Optional parameters
void printInfo(String name, {int? age, String city = "Unknown"}) {
  print("$name, $age years old, from $city");
}
```

### Kotlin
```kotlin
// Basic function
fun greet(name: String): String {
    return "Hello, $name!"
}

// Single expression function
fun greetShort(name: String) = "Hello, $name!"

// Default parameters
fun printInfo(name: String, age: Int? = null, city: String = "Unknown") {
    println("$name, $age years old, from $city")
}

// Named arguments (similar to Dart)
printInfo("John", city = "Boston", age = 30)
```

## Null Safety

Both Dart and Kotlin have null safety, but the syntax differs slightly:

### Dart (Flutter)
```dart
String? nullableName;
String nonNullName = "John";

// Null-aware operators
String displayName = nullableName ?? "Guest";
int? length = nullableName?.length;

// Force unwrap (dangerous!)
String forcedName = nullableName!;
```

### Kotlin
```kotlin
var nullableName: String? = null
var nonNullName: String = "John"

// Elvis operator (similar to ??)
val displayName = nullableName ?: "Guest"
val length = nullableName?.length

// Force unwrap (dangerous!)
val forcedName = nullableName!!
```

## Classes and Objects

### Dart (Flutter)
```dart
class Person {
  final String name;
  int age;
  
  // Constructor
  Person(this.name, this.age);
  
  // Named constructor
  Person.baby(this.name) : age = 0;
  
  // Method
  void sayHello() {
    print("Hello, I'm $name");
  }
}

// Usage
var person = Person("John", 25);
var baby = Person.baby("Emma");
```

### Kotlin
```kotlin
class Person(val name: String, var age: Int) {
    // Secondary constructor
    constructor(name: String) : this(name, 0)
    
    // Method
    fun sayHello() {
        println("Hello, I'm $name")
    }
}

// Data class (similar to Dart's equatable)
data class User(val id: Int, val name: String)

// Usage
val person = Person("John", 25)
val baby = Person("Emma")
```

## Collections

### Dart (Flutter)
```dart
// Lists
List<String> names = ["John", "Jane", "Bob"];
var numbers = [1, 2, 3, 4, 5];

// Maps
Map<String, int> ages = {"John": 25, "Jane": 30};
var scores = {"Math": 90, "Science": 85};

// Operations
names.add("Alice");
var adults = names.where((name) => ages[name]! >= 18).toList();
```

### Kotlin
```kotlin
// Lists
val names: List<String> = listOf("John", "Jane", "Bob")  // Immutable
val mutableNames = mutableListOf("John", "Jane", "Bob")  // Mutable

// Maps
val ages: Map<String, Int> = mapOf("John" to 25, "Jane" to 30)
val mutableAges = mutableMapOf("John" to 25, "Jane" to 30)

// Operations
mutableNames.add("Alice")
val adults = names.filter { name -> ages[name]?.let { it >= 18 } ?: false }
```

## Control Flow

### Dart (Flutter)
```dart
// If-else
if (age >= 18) {
  print("Adult");
} else {
  print("Minor");
}

// Switch
switch (dayOfWeek) {
  case 1:
    print("Monday");
    break;
  case 2:
    print("Tuesday");
    break;
  default:
    print("Other day");
}

// Loops
for (var i = 0; i < 5; i++) {
  print(i);
}

for (var name in names) {
  print(name);
}
```

### Kotlin
```kotlin
// If-else as expression
val status = if (age >= 18) "Adult" else "Minor"

// When expression (more powerful than switch)
val dayName = when (dayOfWeek) {
    1 -> "Monday"
    2 -> "Tuesday"
    3, 4, 5 -> "Midweek"
    else -> "Weekend"
}

// Loops
for (i in 0 until 5) {
    println(i)
}

for (name in names) {
    println(name)
}

// Ranges
for (i in 1..10) {  // 1 to 10 inclusive
    println(i)
}
```

## Extension Functions

Both languages support extending existing classes:

### Dart (Flutter)
```dart
extension StringExtensions on String {
  String get reversed => split('').reversed.join();
  
  bool get isEmail => contains('@') && contains('.');
}

// Usage
print("hello".reversed);  // olleh
```

### Kotlin
```kotlin
fun String.reversed(): String = this.reversed()

val String.isEmail: Boolean
    get() = contains('@') && contains('.')

// Usage
println("hello".reversed())  // olleh
println("test@email.com".isEmail)  // true
```

## Async Programming

### Dart (Flutter)
```dart
// Future (similar to Promise)
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return "Data loaded";
}

// Usage
void loadData() async {
  try {
    String data = await fetchData();
    print(data);
  } catch (e) {
    print("Error: $e");
  }
}

// Streams
Stream<int> countStream() async* {
  for (int i = 1; i <= 5; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}
```

### Kotlin
```kotlin
// Coroutines (similar to async/await)
suspend fun fetchData(): String {
    delay(2000)  // Similar to Future.delayed
    return "Data loaded"
}

// Usage
fun loadData() {
    GlobalScope.launch {
        try {
            val data = fetchData()
            println(data)
        } catch (e: Exception) {
            println("Error: $e")
        }
    }
}

// Flow (similar to Streams)
fun countFlow(): Flow<Int> = flow {
    for (i in 1..5) {
        delay(1000)
        emit(i)
    }
}
```

## Key Kotlin Features to Learn

1. **Scope Functions** (let, apply, run, with, also)
```kotlin
val result = person?.let {
    // Execute if person is not null
    it.age * 2
}

val configured = TextView(context).apply {
    text = "Hello"
    textSize = 20f
}
```

2. **Sealed Classes** (similar to Dart's sealed classes)
```kotlin
sealed class Result<T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error<T>(val exception: Exception) : Result<T>()
}
```

3. **Inline Functions and Reified Types**
```kotlin
inline fun <reified T> parseJson(json: String): T {
    // Can use T as a real type here
    return gson.fromJson(json, T::class.java)
}
```

## Practice Exercise

Convert this Flutter/Dart code to Kotlin:

```dart
class Task {
  final String id;
  final String title;
  bool isCompleted;
  
  Task({required this.id, required this.title, this.isCompleted = false});
  
  void toggle() {
    isCompleted = !isCompleted;
  }
}

List<Task> getTasks() {
  return [
    Task(id: "1", title: "Learn Kotlin"),
    Task(id: "2", title: "Build Android App", isCompleted: true),
  ];
}

void main() {
  var tasks = getTasks();
  var pendingTasks = tasks.where((task) => !task.isCompleted).toList();
  print("Pending tasks: ${pendingTasks.length}");
}
```

## Solution
```kotlin
data class Task(
    val id: String,
    val title: String,
    var isCompleted: Boolean = false
) {
    fun toggle() {
        isCompleted = !isCompleted
    }
}

fun getTasks(): List<Task> {
    return listOf(
        Task(id = "1", title = "Learn Kotlin"),
        Task(id = "2", title = "Build Android App", isCompleted = true)
    )
}

fun main() {
    val tasks = getTasks()
    val pendingTasks = tasks.filter { !it.isCompleted }
    println("Pending tasks: ${pendingTasks.size}")
}
```

## Summary

Kotlin and Dart share many modern language features:
- Both have null safety
- Both support functional programming
- Both have excellent type inference
- Both support async programming

Key differences to remember:
- Kotlin uses `val`/`var` instead of `final`/`var`
- Kotlin's `when` is more powerful than Dart's `switch`
- Kotlin has scope functions that can make code more concise
- Kotlin uses coroutines instead of Futures/async-await

## Next Steps

Now that you understand Kotlin basics, the next lesson will cover setting up Android Studio and creating your first Android project.

---

Previous: [Lesson 1: Introduction](./lesson-1-introduction.md) | Next: [Lesson 3: Android Studio Setup](./lesson-3-android-studio-setup.md)
