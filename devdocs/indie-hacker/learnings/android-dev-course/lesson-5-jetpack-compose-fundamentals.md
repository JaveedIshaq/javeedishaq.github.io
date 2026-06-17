# Lesson 5: Jetpack Compose Fundamentals for Flutter Developers

## Overview

Jetpack Compose is Android's modern declarative UI toolkit. As a Flutter developer, you'll find many familiar concepts since both frameworks use a declarative approach. This lesson maps Flutter concepts to Compose, helping you leverage your existing knowledge.

## Declarative UI: Flutter vs Compose

Both Flutter and Compose use declarative UI paradigms:

### Flutter
```dart
Widget build(BuildContext context) {
  return Container(
    child: Text('Hello Flutter'),
  );
}
```

### Compose
```kotlin
@Composable
fun Greeting() {
    Box {
        Text("Hello Compose")
    }
}
```

## Core Concepts Comparison

| Flutter | Compose | Description |
|---------|---------|-------------|
| Widget | @Composable | UI building block |
| StatelessWidget | @Composable function | Stateless UI |
| StatefulWidget | @Composable with state | Stateful UI |
| setState() | mutableStateOf() | Update UI state |
| BuildContext | Composition | UI tree context |
| Widget tree | Composition tree | UI hierarchy |

## Basic Composables vs Flutter Widgets

### Text

**Flutter:**
```dart
Text(
  'Hello World',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
  textAlign: TextAlign.center,
  maxLines: 2,
  overflow: TextOverflow.ellipsis,
)
```

**Compose:**
```kotlin
Text(
    text = "Hello World",
    fontSize = 24.sp,
    fontWeight = FontWeight.Bold,
    color = Color.Blue,
    textAlign = TextAlign.Center,
    maxLines = 2,
    overflow = TextOverflow.Ellipsis
)
```

### Container/Box

**Flutter:**
```dart
Container(
  width: 200,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
  ),
  child: Text('Content'),
)
```

**Compose:**
```kotlin
Box(
    modifier = Modifier
        .size(width = 200.dp, height = 100.dp)
        .padding(16.dp)
        .padding(horizontal = 8.dp)
        .background(
            color = Color.Blue,
            shape = RoundedCornerShape(8.dp)
        )
) {
    Text("Content")
}
```

### Image

**Flutter:**
```dart
// Network image
Image.network(
  'https://example.com/image.jpg',
  width: 100,
  height: 100,
  fit: BoxFit.cover,
)

// Asset image
Image.asset(
  'assets/images/logo.png',
  width: 100,
  height: 100,
)
```

**Compose:**
```kotlin
// Network image (using Coil library)
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = "Description",
    modifier = Modifier.size(100.dp),
    contentScale = ContentScale.Crop
)

// Resource image
Image(
    painter = painterResource(id = R.drawable.logo),
    contentDescription = "Logo",
    modifier = Modifier.size(100.dp)
)
```

### Button

**Flutter:**
```dart
ElevatedButton(
  onPressed: () {
    print('Button pressed');
  },
  style: ElevatedButton.styleFrom(
    primary: Colors.blue,
    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
  ),
  child: Text('Click me'),
)
```

**Compose:**
```kotlin
Button(
    onClick = {
        println("Button pressed")
    },
    colors = ButtonDefaults.buttonColors(
        containerColor = Color.Blue
    ),
    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 10.dp)
) {
    Text("Click me")
}
```

## Layout System

### Column (Vertical Layout)

**Flutter:**
```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Item 1'),
    SizedBox(height: 8),
    Text('Item 2'),
    Text('Item 3'),
  ],
)
```

**Compose:**
```kotlin
Column(
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.Start
) {
    Text("Item 1")
    Spacer(modifier = Modifier.height(8.dp))
    Text("Item 2")
    Text("Item 3")
}
```

### Row (Horizontal Layout)

**Flutter:**
```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    Icon(Icons.star),
    Text('5.0'),
    Spacer(),
    TextButton(
      onPressed: () {},
      child: Text('BOOK'),
    ),
  ],
)
```

**Compose:**
```kotlin
Row(
    horizontalArrangement = Arrangement.SpaceBetween,
    modifier = Modifier.fillMaxWidth()
) {
    Icon(Icons.Default.Star, contentDescription = null)
    Text("5.0")
    Spacer(modifier = Modifier.weight(1f))
    TextButton(onClick = { }) {
        Text("BOOK")
    }
}
```

### Stack/Box

**Flutter:**
```dart
Stack(
  alignment: Alignment.center,
  children: [
    Container(
      width: 200,
      height: 200,
      color: Colors.blue,
    ),
    Positioned(
      top: 10,
      right: 10,
      child: Icon(Icons.close),
    ),
    Text('Centered Text'),
  ],
)
```

**Compose:**
```kotlin
Box(
    contentAlignment = Alignment.Center,
    modifier = Modifier.size(200.dp)
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Blue)
    )
    Icon(
        Icons.Default.Close,
        contentDescription = null,
        modifier = Modifier.align(Alignment.TopEnd).padding(10.dp)
    )
    Text("Centered Text")
}
```

## State Management

### Basic State

**Flutter:**
```dart
class CounterWidget extends StatefulWidget {
  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _counter++;
            });
          },
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

**Compose:**
```kotlin
@Composable
fun CounterWidget() {
    var counter by remember { mutableStateOf(0) }
    
    Column {
        Text("Count: $counter")
        Button(onClick = { counter++ }) {
            Text("Increment")
        }
    }
}
```

### State Hoisting

**Flutter:**
```dart
// Parent widget
class ParentWidget extends StatefulWidget {
  @override
  _ParentWidgetState createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  String _text = '';

  @override
  Widget build(BuildContext context) {
    return ChildWidget(
      text: _text,
      onTextChanged: (newText) {
        setState(() {
          _text = newText;
        });
      },
    );
  }
}

// Child widget
class ChildWidget extends StatelessWidget {
  final String text;
  final Function(String) onTextChanged;

  ChildWidget({required this.text, required this.onTextChanged});

  @override
  Widget build(BuildContext context) {
    return TextField(
      value: text,
      onChanged: onTextChanged,
    );
  }
}
```

**Compose:**
```kotlin
// Parent composable
@Composable
fun ParentComposable() {
    var text by remember { mutableStateOf("") }
    
    ChildComposable(
        text = text,
        onTextChanged = { newText -> text = newText }
    )
}

// Child composable
@Composable
fun ChildComposable(
    text: String,
    onTextChanged: (String) -> Unit
) {
    TextField(
        value = text,
        onValueChange = onTextChanged,
        label = { Text("Enter text") }
    )
}
```

## Lists and Scrolling

### ListView/LazyColumn

**Flutter:**
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].title),
      subtitle: Text(items[index].subtitle),
      leading: Icon(Icons.star),
      onTap: () {
        // Handle tap
      },
    );
  },
)
```

**Compose:**
```kotlin
LazyColumn {
    items(items) { item ->
        ListItem(
            headlineContent = { Text(item.title) },
            supportingContent = { Text(item.subtitle) },
            leadingContent = {
                Icon(Icons.Default.Star, contentDescription = null)
            },
            modifier = Modifier.clickable {
                // Handle click
            }
        )
    }
}
```

### GridView/LazyVerticalGrid

**Flutter:**
```dart
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 10,
    mainAxisSpacing: 10,
  ),
  itemCount: items.length,
  itemBuilder: (context, index) {
    return Card(
      child: Center(
        child: Text(items[index]),
      ),
    );
  },
)
```

**Compose:**
```kotlin
LazyVerticalGrid(
    columns = GridCells.Fixed(2),
    horizontalArrangement = Arrangement.spacedBy(10.dp),
    verticalArrangement = Arrangement.spacedBy(10.dp)
) {
    items(items) { item ->
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.padding(16.dp)
            ) {
                Text(item)
            }
        }
    }
}
```

## Modifiers: The Compose Way

Modifiers in Compose are similar to widget properties in Flutter but chained:

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello",
        modifier = Modifier
            .fillMaxWidth()           // width: double.infinity
            .padding(16.dp)          // padding: EdgeInsets.all(16)
            .background(Color.Gray)   // Container(color: Colors.grey)
            .clickable { }           // GestureDetector(onTap: () {})
            .clip(CircleShape)       // ClipOval
    )
}
```

### Common Modifiers

| Flutter | Compose Modifier |
|---------|-----------------|
| `width: 100` | `.width(100.dp)` |
| `height: double.infinity` | `.fillMaxHeight()` |
| `padding: EdgeInsets.all(16)` | `.padding(16.dp)` |
| `margin: EdgeInsets.all(8)` | `.padding(8.dp)` on parent |
| `Container(color: Colors.red)` | `.background(Color.Red)` |
| `GestureDetector(onTap: (){})` | `.clickable { }` |
| `ClipRRect` | `.clip(RoundedCornerShape())` |
| `Opacity(opacity: 0.5)` | `.alpha(0.5f)` |

## Theming

### Flutter Theme
```dart
MaterialApp(
  theme: ThemeData(
    primaryColor: Colors.blue,
    accentColor: Colors.orange,
    textTheme: TextTheme(
      headline1: TextStyle(fontSize: 72, fontWeight: FontWeight.bold),
    ),
  ),
  home: MyHomePage(),
)

// Using theme
Text(
  'Title',
  style: Theme.of(context).textTheme.headline1,
)
```

### Compose Theme
```kotlin
@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) {
        darkColorScheme(
            primary = Color(0xFF1976D2),
            secondary = Color(0xFFFF6F00)
        )
    } else {
        lightColorScheme(
            primary = Color(0xFF1976D2),
            secondary = Color(0xFFFF6F00)
        )
    }

    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        content = content
    )
}

// Using theme
@Composable
fun ThemedText() {
    Text(
        text = "Title",
        style = MaterialTheme.typography.headlineLarge,
        color = MaterialTheme.colorScheme.primary
    )
}
```

## Animations

### Simple Animation

**Flutter:**
```dart
AnimatedContainer(
  duration: Duration(milliseconds: 300),
  width: _expanded ? 200 : 100,
  height: _expanded ? 200 : 100,
  color: _expanded ? Colors.blue : Colors.red,
  child: Text('Tap me'),
)
```

**Compose:**
```kotlin
@Composable
fun AnimatedBox() {
    var expanded by remember { mutableStateOf(false) }
    val size by animateDpAsState(
        targetValue = if (expanded) 200.dp else 100.dp,
        animationSpec = tween(300)
    )
    val color by animateColorAsState(
        targetValue = if (expanded) Color.Blue else Color.Red,
        animationSpec = tween(300)
    )
    
    Box(
        modifier = Modifier
            .size(size)
            .background(color)
            .clickable { expanded = !expanded },
        contentAlignment = Alignment.Center
    ) {
        Text("Tap me")
    }
}
```

## Side Effects

### LaunchedEffect (Similar to initState/useEffect)

```kotlin
@Composable
fun TimerScreen() {
    var seconds by remember { mutableStateOf(0) }
    
    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            seconds++
        }
    }
    
    Text("Seconds: $seconds")
}
```

### DisposableEffect (Similar to dispose)

```kotlin
@Composable
fun LocationTracker() {
    DisposableEffect(Unit) {
        val listener = startLocationUpdates()
        
        onDispose {
            stopLocationUpdates(listener)
        }
    }
}
```

## Practical Example: Todo List App

Let's build a simple Todo app showing Flutter and Compose side by side:

### Flutter Version
```dart
class TodoApp extends StatefulWidget {
  @override
  _TodoAppState createState() => _TodoAppState();
}

class _TodoAppState extends State<TodoApp> {
  List<Todo> todos = [];
  TextEditingController controller = TextEditingController();

  void addTodo() {
    if (controller.text.isNotEmpty) {
      setState(() {
        todos.add(Todo(controller.text, false));
        controller.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Todo App')),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: controller,
                    decoration: InputDecoration(
                      hintText: 'Enter todo',
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.add),
                  onPressed: addTodo,
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: todos.length,
              itemBuilder: (context, index) {
                return CheckboxListTile(
                  title: Text(todos[index].title),
                  value: todos[index].completed,
                  onChanged: (value) {
                    setState(() {
                      todos[index].completed = value!;
                    });
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

### Compose Version
```kotlin
@Composable
fun TodoApp() {
    var todos by remember { mutableStateOf(listOf<Todo>()) }
    var text by remember { mutableStateOf("") }
    
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Todo App") })
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier.padding(paddingValues)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextField(
                    value = text,
                    onValueChange = { text = it },
                    label = { Text("Enter todo") },
                    modifier = Modifier.weight(1f)
                )
                IconButton(
                    onClick = {
                        if (text.isNotEmpty()) {
                            todos = todos + Todo(text, false)
                            text = ""
                        }
                    }
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add")
                }
            }
            
            LazyColumn {
                itemsIndexed(todos) { index, todo ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = todo.completed,
                            onCheckedChange = { checked ->
                                todos = todos.toMutableList().also {
                                    it[index] = todo.copy(completed = checked)
                                }
                            }
                        )
                        Text(
                            text = todo.title,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
            }
        }
    }
}

data class Todo(val title: String, val completed: Boolean)
```

## Best Practices

1. **Remember State Correctly**
   - Use `remember` for composable-scoped state
   - Use `rememberSaveable` for configuration change survival

2. **Optimize Recomposition**
   - Keep composables small and focused
   - Use `key` parameter for list items
   - Avoid inline lambdas when possible

3. **Follow Material Design**
   - Use Material3 components
   - Respect theming system
   - Handle dark mode properly

4. **Testing**
   - Write composable tests
   - Use semantics for accessibility
   - Test different screen sizes

## Summary

Jetpack Compose and Flutter share many concepts:
- Both use declarative UI
- Similar widget/composable tree structure
- State management through reactive updates
- Material Design implementation

Key differences:
- Compose uses Modifiers instead of widget properties
- State management is more explicit in Compose
- Compose integrates better with Android ecosystem
- Different animation APIs but similar concepts

Coming from Flutter, you'll find Compose familiar and powerful. The main adjustment is learning Kotlin syntax and Android-specific patterns.

---

Previous: [Lesson 4: Android Components](./lesson-4-android-components.md) | Next: [Lesson 6: State Management](./lesson-6-state-management.md)
