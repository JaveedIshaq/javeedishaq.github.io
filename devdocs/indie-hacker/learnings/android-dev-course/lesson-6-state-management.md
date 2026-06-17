# Lesson 6: State Management in Android vs Flutter

## Overview

State management is crucial in both Android and Flutter development. This lesson explores Android's state management approaches using Jetpack Compose and ViewModel, comparing them with Flutter's state management solutions like Provider, Riverpod, and Bloc.

## State Management Comparison

| Flutter | Android (Compose) | Purpose |
|---------|------------------|---------|
| setState | mutableStateOf | Local UI state |
| Provider/Riverpod | ViewModel | App-wide state |
| Bloc/Cubit | ViewModel + StateFlow | Complex state with events |
| GetX | Hilt + ViewModel | State + Dependency Injection |
| Redux | MVI pattern | Unidirectional data flow |

## Local State Management

### Flutter: StatefulWidget
```dart
class CounterScreen extends StatefulWidget {
  @override
  _CounterScreenState createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  int counter = 0;
  
  void increment() {
    setState(() {
      counter++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $counter'),
        ElevatedButton(
          onPressed: increment,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

### Android: Compose State
```kotlin
@Composable
fun CounterScreen() {
    // Simple state
    var counter by remember { mutableStateOf(0) }
    
    Column {
        Text("Count: $counter")
        Button(onClick = { counter++ }) {
            Text("Increment")
        }
    }
}

// State that survives configuration changes
@Composable
fun PersistentCounterScreen() {
    var counter by rememberSaveable { mutableStateOf(0) }
    
    Column {
        Text("Count: $counter")
        Button(onClick = { counter++ }) {
            Text("Increment")
        }
    }
}
```

## ViewModel: Android's Provider Equivalent

### Basic ViewModel

```kotlin
// ViewModel definition
class CounterViewModel : ViewModel() {
    private val _counter = MutableStateFlow(0)
    val counter: StateFlow<Int> = _counter.asStateFlow()
    
    fun increment() {
        _counter.value++
    }
    
    fun decrement() {
        _counter.value--
    }
}

// Using ViewModel in Compose
@Composable
fun CounterScreen(
    viewModel: CounterViewModel = viewModel()
) {
    val counter by viewModel.counter.collectAsState()
    
    Column {
        Text("Count: $counter")
        Row {
            Button(onClick = { viewModel.decrement() }) {
                Text("-")
            }
            Button(onClick = { viewModel.increment() }) {
                Text("+")
            }
        }
    }
}
```

### Flutter Equivalent with Provider

```dart
// ViewModel equivalent
class CounterProvider extends ChangeNotifier {
  int _counter = 0;
  int get counter => _counter;
  
  void increment() {
    _counter++;
    notifyListeners();
  }
  
  void decrement() {
    _counter--;
    notifyListeners();
  }
}

// Using Provider
class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<CounterProvider>(
      builder: (context, provider, child) {
        return Column(
          children: [
            Text('Count: ${provider.counter}'),
            Row(
              children: [
                ElevatedButton(
                  onPressed: provider.decrement,
                  child: Text('-'),
                ),
                ElevatedButton(
                  onPressed: provider.increment,
                  child: Text('+'),
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}
```

## Complex State Management

### Android: ViewModel with State Class

```kotlin
// State definition
data class TodoListState(
    val todos: List<Todo> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

// ViewModel with complex state
class TodoViewModel : ViewModel() {
    private val _state = MutableStateFlow(TodoListState())
    val state: StateFlow<TodoListState> = _state.asStateFlow()
    
    fun loadTodos() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            try {
                val todos = repository.getTodos()
                _state.update { 
                    it.copy(todos = todos, isLoading = false, error = null)
                }
            } catch (e: Exception) {
                _state.update { 
                    it.copy(isLoading = false, error = e.message)
                }
            }
        }
    }
    
    fun addTodo(title: String) {
        val newTodo = Todo(
            id = UUID.randomUUID().toString(),
            title = title,
            completed = false
        )
        _state.update { 
            it.copy(todos = it.todos + newTodo)
        }
    }
    
    fun toggleTodo(id: String) {
        _state.update { state ->
            state.copy(
                todos = state.todos.map { todo ->
                    if (todo.id == id) {
                        todo.copy(completed = !todo.completed)
                    } else {
                        todo
                    }
                }
            )
        }
    }
}

// UI Component
@Composable
fun TodoListScreen(
    viewModel: TodoViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    
    when {
        state.isLoading -> {
            Box(modifier = Modifier.fillMaxSize()) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            }
        }
        state.error != null -> {
            ErrorMessage(state.error)
        }
        else -> {
            TodoList(
                todos = state.todos,
                onToggle = viewModel::toggleTodo
            )
        }
    }
}
```

### Flutter Equivalent with Bloc

```dart
// Events
abstract class TodoEvent {}
class LoadTodos extends TodoEvent {}
class AddTodo extends TodoEvent {
  final String title;
  AddTodo(this.title);
}
class ToggleTodo extends TodoEvent {
  final String id;
  ToggleTodo(this.id);
}

// States
abstract class TodoState {}
class TodoInitial extends TodoState {}
class TodoLoading extends TodoState {}
class TodoLoaded extends TodoState {
  final List<Todo> todos;
  TodoLoaded(this.todos);
}
class TodoError extends TodoState {
  final String message;
  TodoError(this.message);
}

// Bloc
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  final TodoRepository repository;
  
  TodoBloc(this.repository) : super(TodoInitial()) {
    on<LoadTodos>(_onLoadTodos);
    on<AddTodo>(_onAddTodo);
    on<ToggleTodo>(_onToggleTodo);
  }
  
  Future<void> _onLoadTodos(LoadTodos event, Emitter<TodoState> emit) async {
    emit(TodoLoading());
    try {
      final todos = await repository.getTodos();
      emit(TodoLoaded(todos));
    } catch (e) {
      emit(TodoError(e.toString()));
    }
  }
  
  void _onAddTodo(AddTodo event, Emitter<TodoState> emit) {
    if (state is TodoLoaded) {
      final todos = (state as TodoLoaded).todos;
      final newTodo = Todo(
        id: DateTime.now().toString(),
        title: event.title,
        completed: false,
      );
      emit(TodoLoaded([...todos, newTodo]));
    }
  }
}
```

## Dependency Injection

### Android: Hilt

```kotlin
// Module definition
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideTodoRepository(
        api: TodoApi,
        dao: TodoDao
    ): TodoRepository {
        return TodoRepositoryImpl(api, dao)
    }
}

// ViewModel with Hilt
@HiltViewModel
class TodoViewModel @Inject constructor(
    private val repository: TodoRepository
) : ViewModel() {
    // ViewModel implementation
}

// Activity/Composable
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TodoApp()
        }
    }
}

@Composable
fun TodoScreen(
    viewModel: TodoViewModel = hiltViewModel()
) {
    // UI implementation
}
```

### Flutter: Provider/Riverpod

```dart
// Provider setup
final todoRepositoryProvider = Provider<TodoRepository>((ref) {
  return TodoRepositoryImpl();
});

final todoViewModelProvider = StateNotifierProvider<TodoViewModel, TodoState>((ref) {
  final repository = ref.watch(todoRepositoryProvider);
  return TodoViewModel(repository);
});

// Using in Widget
class TodoScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(todoViewModelProvider);
    
    return state.when(
      loading: () => CircularProgressIndicator(),
      error: (error) => Text('Error: $error'),
      data: (todos) => TodoList(todos: todos),
    );
  }
}
```

## Shared State Between Screens

### Android: Shared ViewModel

```kotlin
// Shared ViewModel
class SharedViewModel : ViewModel() {
    private val _selectedUser = MutableStateFlow<User?>(null)
    val selectedUser: StateFlow<User?> = _selectedUser.asStateFlow()
    
    fun selectUser(user: User) {
        _selectedUser.value = user
    }
}

// Screen A
@Composable
fun UserListScreen(
    navController: NavController,
    sharedViewModel: SharedViewModel = activityViewModel()
) {
    val users = listOf(/* ... */)
    
    LazyColumn {
        items(users) { user ->
            ListItem(
                headlineContent = { Text(user.name) },
                modifier = Modifier.clickable {
                    sharedViewModel.selectUser(user)
                    navController.navigate("userDetail")
                }
            )
        }
    }
}

// Screen B
@Composable
fun UserDetailScreen(
    sharedViewModel: SharedViewModel = activityViewModel()
) {
    val user by sharedViewModel.selectedUser.collectAsState()
    
    user?.let {
        Column {
            Text("Name: ${it.name}")
            Text("Email: ${it.email}")
        }
    }
}
```

### Flutter: InheritedWidget/Provider

```dart
// Shared state
class SharedState extends ChangeNotifier {
  User? _selectedUser;
  User? get selectedUser => _selectedUser;
  
  void selectUser(User user) {
    _selectedUser = user;
    notifyListeners();
  }
}

// Screen A
class UserListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final sharedState = Provider.of<SharedState>(context, listen: false);
    final users = [/* ... */];
    
    return ListView.builder(
      itemCount: users.length,
      itemBuilder: (context, index) {
        final user = users[index];
        return ListTile(
          title: Text(user.name),
          onTap: () {
            sharedState.selectUser(user);
            Navigator.pushNamed(context, '/userDetail');
          },
        );
      },
    );
  }
}

// Screen B
class UserDetailScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final sharedState = Provider.of<SharedState>(context);
    final user = sharedState.selectedUser;
    
    if (user == null) return Text('No user selected');
    
    return Column(
      children: [
        Text('Name: ${user.name}'),
        Text('Email: ${user.email}'),
      ],
    );
  }
}
```

## MVI Pattern (Model-View-Intent)

### Android MVI Implementation

```kotlin
// Intent (User actions)
sealed class TodoIntent {
    object LoadTodos : TodoIntent()
    data class AddTodo(val title: String) : TodoIntent()
    data class ToggleTodo(val id: String) : TodoIntent()
    data class DeleteTodo(val id: String) : TodoIntent()
}

// State
data class TodoViewState(
    val isLoading: Boolean = false,
    val todos: List<Todo> = emptyList(),
    val error: String? = null
)

// Effect (Side effects)
sealed class TodoEffect {
    data class ShowToast(val message: String) : TodoEffect()
    object NavigateBack : TodoEffect()
}

// ViewModel with MVI
class TodoMviViewModel : ViewModel() {
    private val _state = MutableStateFlow(TodoViewState())
    val state: StateFlow<TodoViewState> = _state.asStateFlow()
    
    private val _effect = Channel<TodoEffect>()
    val effect = _effect.receiveAsFlow()
    
    fun processIntent(intent: TodoIntent) {
        when (intent) {
            is TodoIntent.LoadTodos -> loadTodos()
            is TodoIntent.AddTodo -> addTodo(intent.title)
            is TodoIntent.ToggleTodo -> toggleTodo(intent.id)
            is TodoIntent.DeleteTodo -> deleteTodo(intent.id)
        }
    }
    
    private fun loadTodos() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            try {
                val todos = repository.getTodos()
                _state.update { 
                    it.copy(todos = todos, isLoading = false)
                }
            } catch (e: Exception) {
                _state.update { 
                    it.copy(isLoading = false, error = e.message)
                }
                _effect.send(TodoEffect.ShowToast("Failed to load todos"))
            }
        }
    }
}

// UI with MVI
@Composable
fun TodoMviScreen(
    viewModel: TodoMviViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current
    
    // Handle effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is TodoEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
                is TodoEffect.NavigateBack -> {
                    // Handle navigation
                }
            }
        }
    }
    
    TodoContent(
        state = state,
        onIntent = viewModel::processIntent
    )
}
```

## Best Practices

### Android State Management

1. **Choose the Right Scope**
   - `remember`: Composable-scoped state
   - `rememberSaveable`: Survives configuration changes
   - `ViewModel`: Screen-scoped state
   - `@Singleton`: App-scoped state

2. **State Hoisting**
   ```kotlin
   // Good: State hoisted to parent
   @Composable
   fun TodoApp() {
       val todos = remember { mutableStateListOf<Todo>() }
       
       TodoList(
           todos = todos,
           onAddTodo = { todo -> todos.add(todo) }
       )
   }
   
   @Composable
   fun TodoList(
       todos: List<Todo>,
       onAddTodo: (Todo) -> Unit
   ) {
       // Stateless composable
   }
   ```

3. **Immutable State**
   ```kotlin
   // Good: Immutable state updates
   _state.update { currentState ->
       currentState.copy(
           todos = currentState.todos + newTodo
       )
   }
   
   // Bad: Direct mutation
   _state.value.todos.add(newTodo)
   ```

### Flutter State Management

1. **Separation of Concerns**
   ```dart
   // Good: Business logic separated
   class TodoRepository {
     Future<List<Todo>> getTodos() async { }
   }
   
   class TodoProvider extends ChangeNotifier {
     final TodoRepository repository;
     
     TodoProvider(this.repository);
   }
   ```

2. **Avoid Rebuilding Entire Tree**
   ```dart
   // Good: Selective rebuilding
   Consumer<TodoProvider>(
     builder: (context, provider, child) {
       return TodoList(todos: provider.todos);
     },
   )
   
   // Better: Even more selective
   Selector<TodoProvider, int>(
     selector: (_, provider) => provider.todoCount,
     builder: (context, count, child) {
       return Text('Count: $count');
     },
   )
   ```

## Testing State Management

### Android Testing

```kotlin
class TodoViewModelTest {
    @Test
    fun `add todo updates state correctly`() = runTest {
        // Arrange
        val viewModel = TodoViewModel()
        val collector = viewModel.state.testIn(this)
        
        // Act
        viewModel.addTodo("New Todo")
        
        // Assert
        val state = collector.latestValue
        assertEquals(1, state.todos.size)
        assertEquals("New Todo", state.todos.first().title)
    }
}
```

### Flutter Testing

```dart
void main() {
  group('TodoProvider Tests', () {
    test('add todo updates state correctly', () {
      // Arrange
      final provider = TodoProvider();
      
      // Act
      provider.addTodo('New Todo');
      
      // Assert
      expect(provider.todos.length, 1);
      expect(provider.todos.first.title, 'New Todo');
    });
  });
}
```

## Summary

Key similarities between Android and Flutter state management:
- Both use reactive state updates
- Both support local and global state
- Both have patterns for complex state (MVI/Bloc)
- Both emphasize immutability

Key differences:
- Android uses Kotlin's coroutines and Flow
- Flutter uses Streams and ChangeNotifier
- Android's ViewModel is lifecycle-aware by default
- Flutter requires more boilerplate for DI

Choose the right tool:
- Simple state: `remember`/`setState`
- Screen state: `ViewModel`/`Provider`
- Complex state: MVI/Bloc pattern
- Global state: Hilt + ViewModel/Riverpod

---

Previous: [Lesson 5: Jetpack Compose Fundamentals](./lesson-5-jetpack-compose-fundamentals.md) | Next: [Lesson 7: Navigation](./lesson-7-navigation.md)
