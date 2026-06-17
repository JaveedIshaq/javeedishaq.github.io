# Lesson 10: Testing in Android vs Flutter

## Overview

Testing is crucial for maintaining code quality and preventing regressions. Both Android and Flutter provide comprehensive testing frameworks. This lesson compares testing approaches, tools, and best practices for both platforms.

## Testing Types Comparison

| Test Type | Flutter | Android |
|-----------|---------|---------|
| Unit Tests | `test` package | JUnit, MockK |
| Widget/UI Tests | Widget tests | Compose UI tests |
| Integration Tests | Integration tests | Instrumented tests |
| E2E Tests | Flutter Driver | Espresso, UI Automator |
| Mocking | Mockito, mocktail | MockK, Mockito-Kotlin |
| Coverage | Built-in | JaCoCo |

## Unit Testing

### Android Unit Testing

```kotlin
// Dependencies (build.gradle.kts)
dependencies {
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
    testImplementation("io.mockk:mockk:1.13.8")
    testImplementation("com.google.truth:truth:1.1.5")
    testImplementation("app.cash.turbine:turbine:1.0.0")
}

// Example: Testing a ViewModel
class UserViewModelTest {
    
    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()
    
    private val testDispatcher = StandardTestDispatcher()
    private lateinit var userRepository: UserRepository
    private lateinit var viewModel: UserViewModel
    
    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        userRepository = mockk()
        viewModel = UserViewModel(userRepository)
    }
    
    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }
    
    @Test
    fun `loadUser success updates state correctly`() = runTest {
        // Arrange
        val userId = "123"
        val expectedUser = User(
            id = userId,
            name = "John Doe",
            email = "john@example.com"
        )
        coEvery { userRepository.getUser(userId) } returns expectedUser
        
        // Act
        viewModel.loadUser(userId)
        advanceUntilIdle()
        
        // Assert
        viewModel.userState.test {
            val state = awaitItem()
            assertThat(state).isInstanceOf(UiState.Success::class.java)
            assertThat((state as UiState.Success).data).isEqualTo(expectedUser)
        }
    }
    
    @Test
    fun `loadUser failure updates state with error`() = runTest {
        // Arrange
        val userId = "123"
        val errorMessage = "User not found"
        coEvery { userRepository.getUser(userId) } throws Exception(errorMessage)
        
        // Act
        viewModel.loadUser(userId)
        advanceUntilIdle()
        
        // Assert
        viewModel.userState.test {
            val state = awaitItem()
            assertThat(state).isInstanceOf(UiState.Error::class.java)
            assertThat((state as UiState.Error).message).isEqualTo(errorMessage)
        }
    }
}

// Testing a Repository
class UserRepositoryTest {
    
    private lateinit var userDao: UserDao
    private lateinit var apiService: ApiService
    private lateinit var repository: UserRepositoryImpl
    
    @Before
    fun setup() {
        userDao = mockk()
        apiService = mockk()
        repository = UserRepositoryImpl(userDao, apiService)
    }
    
    @Test
    fun `getUser returns cached user when available`() = runTest {
        // Arrange
        val userId = "123"
        val cachedUser = UserEntity(
            id = userId,
            name = "Cached User",
            email = "cached@example.com",
            createdAt = Date()
        )
        coEvery { userDao.getUser(userId) } returns cachedUser
        
        // Act
        val result = repository.getUser(userId)
        
        // Assert
        assertThat(result).isNotNull()
        assertThat(result?.name).isEqualTo("Cached User")
        coVerify(exactly = 0) { apiService.getUser(any()) }
    }
}

// Testing Composables
class MathUtilsTest {
    
    @Test
    fun `calculateTax returns correct amount`() {
        // Arrange
        val amount = 100.0
        val taxRate = 0.08
        
        // Act
        val result = MathUtils.calculateTax(amount, taxRate)
        
        // Assert
        assertThat(result).isEqualTo(8.0)
    }
    
    @Test
    fun `formatCurrency formats correctly for USD`() {
        // Arrange
        val amount = 1234.56
        
        // Act
        val result = MathUtils.formatCurrency(amount, "USD")
        
        // Assert
        assertThat(result).isEqualTo("$1,234.56")
    }
}
```

### Flutter Unit Testing

```dart
// Dependencies (pubspec.yaml)
dev_dependencies:
  test: ^1.24.0
  mockito: ^5.4.0
  build_runner: ^2.4.0
  mocktail: ^1.0.0

// Example: Testing a Provider/Bloc
import 'package:test/test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

@GenerateMocks([UserRepository])
void main() {
  late MockUserRepository mockRepository;
  late UserViewModel viewModel;
  
  setUp(() {
    mockRepository = MockUserRepository();
    viewModel = UserViewModel(mockRepository);
  });
  
  group('UserViewModel', () {
    test('loadUser success updates state correctly', () async {
      // Arrange
      const userId = '123';
      final expectedUser = User(
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      );
      
      when(mockRepository.getUser(userId))
          .thenAnswer((_) async => expectedUser);
      
      // Act
      await viewModel.loadUser(userId);
      
      // Assert
      expect(viewModel.state, isA<UserLoaded>());
      expect((viewModel.state as UserLoaded).user, equals(expectedUser));
    });
    
    test('loadUser failure updates state with error', () async {
      // Arrange
      const userId = '123';
      const errorMessage = 'User not found';
      
      when(mockRepository.getUser(userId))
          .thenThrow(Exception(errorMessage));
      
      // Act
      await viewModel.loadUser(userId);
      
      // Assert
      expect(viewModel.state, isA<UserError>());
      expect((viewModel.state as UserError).message, contains(errorMessage));
    });
  });
}

// Testing with Mocktail (null-safe alternative)
import 'package:mocktail/mocktail.dart';

class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late MockUserRepository mockRepository;
  late UserBloc userBloc;
  
  setUp(() {
    mockRepository = MockUserRepository();
    userBloc = UserBloc(mockRepository);
  });
  
  group('UserBloc', () {
    blocTest<UserBloc, UserState>(
      'emits [UserLoading, UserLoaded] when LoadUser succeeds',
      build: () {
        when(() => mockRepository.getUser(any()))
            .thenAnswer((_) async => User(id: '1', name: 'Test'));
        return userBloc;
      },
      act: (bloc) => bloc.add(LoadUser('1')),
      expect: () => [
        UserLoading(),
        UserLoaded(User(id: '1', name: 'Test')),
      ],
    );
  });
}

// Testing utility functions
void main() {
  group('MathUtils', () {
    test('calculateTax returns correct amount', () {
      // Arrange
      const amount = 100.0;
      const taxRate = 0.08;
      
      // Act
      final result = MathUtils.calculateTax(amount, taxRate);
      
      // Assert
      expect(result, equals(8.0));
    });
    
    test('formatCurrency formats correctly for USD', () {
      // Arrange
      const amount = 1234.56;
      
      // Act
      final result = MathUtils.formatCurrency(amount, 'USD');
      
      // Assert
      expect(result, equals(r'$1,234.56'));
    });
  });
}
```

## UI/Widget Testing

### Android Compose UI Testing

```kotlin
// Dependencies
androidTestImplementation("androidx.compose.ui:ui-test-junit4:$compose_version")
debugImplementation("androidx.compose.ui:ui-test-manifest:$compose_version")

// Testing Composables
class LoginScreenTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Test
    fun loginButton_isDisabled_whenFieldsAreEmpty() {
        // Arrange
        composeTestRule.setContent {
            LoginScreen()
        }
        
        // Assert
        composeTestRule
            .onNodeWithTag("login_button")
            .assertIsNotEnabled()
    }
    
    @Test
    fun loginButton_isEnabled_whenFieldsAreFilled() {
        // Arrange
        composeTestRule.setContent {
            LoginScreen()
        }
        
        // Act
        composeTestRule
            .onNodeWithTag("email_field")
            .performTextInput("test@example.com")
        
        composeTestRule
            .onNodeWithTag("password_field")
            .performTextInput("password123")
        
        // Assert
        composeTestRule
            .onNodeWithTag("login_button")
            .assertIsEnabled()
    }
    
    @Test
    fun errorMessage_isDisplayed_whenLoginFails() {
        // Arrange
        val mockViewModel = mockk<LoginViewModel>()
        every { mockViewModel.loginState } returns 
            MutableStateFlow(LoginState.Error("Invalid credentials"))
        
        composeTestRule.setContent {
            LoginScreen(viewModel = mockViewModel)
        }
        
        // Assert
        composeTestRule
            .onNodeWithText("Invalid credentials")
            .assertIsDisplayed()
    }
}

// Testing navigation
class NavigationTest {
    
    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()
    
    @Test
    fun navHost_navigatesToDetailScreen_whenItemClicked() {
        // Act
        composeTestRule.onNodeWithText("Item 1").performClick()
        
        // Assert
        composeTestRule
            .onNodeWithTag("detail_screen")
            .assertIsDisplayed()
    }
}

// Testing with semantics
@Composable
fun AccessibleButton(
    text: String,
    onClick: () -> Unit,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier.semantics {
            contentDescription = "$text button"
            testTag = "${text.lowercase()}_button"
        }
    ) {
        Text(text)
    }
}

@Test
fun accessibleButton_hasCorrectSemantics() {
    composeTestRule.setContent {
        AccessibleButton(
            text = "Submit",
            onClick = {}
        )
    }
    
    composeTestRule
        .onNode(hasContentDescription("Submit button"))
        .assertExists()
        .assertIsEnabled()
}
```

### Flutter Widget Testing

```dart
// Testing widgets
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:mockito/mockito.dart';

void main() {
  group('LoginScreen', () {
    testWidgets('login button is disabled when fields are empty', 
        (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginScreen(),
        ),
      );
      
      // Assert
      final loginButton = find.byKey(Key('login_button'));
      expect(loginButton, findsOneWidget);
      
      final button = tester.widget<ElevatedButton>(loginButton);
      expect(button.onPressed, isNull);
    });
    
    testWidgets('login button is enabled when fields are filled', 
        (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginScreen(),
        ),
      );
      
      // Act
      await tester.enterText(
        find.byKey(Key('email_field')), 
        'test@example.com'
      );
      await tester.enterText(
        find.byKey(Key('password_field')), 
        'password123'
      );
      await tester.pump();
      
      // Assert
      final loginButton = find.byKey(Key('login_button'));
      final button = tester.widget<ElevatedButton>(loginButton);
      expect(button.onPressed, isNotNull);
    });
    
    testWidgets('shows error message when login fails', 
        (WidgetTester tester) async {
      // Arrange
      final mockViewModel = MockLoginViewModel();
      when(mockViewModel.errorMessage).thenReturn('Invalid credentials');
      
      await tester.pumpWidget(
        MaterialApp(
          home: ChangeNotifierProvider.value(
            value: mockViewModel,
            child: LoginScreen(),
          ),
        ),
      );
      
      // Assert
      expect(find.text('Invalid credentials'), findsOneWidget);
    });
  });
  
  // Testing navigation
  testWidgets('navigates to detail screen when item tapped', 
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ItemListScreen(),
        routes: {
          '/detail': (context) => DetailScreen(),
        },
      ),
    );
    
    // Act
    await tester.tap(find.text('Item 1'));
    await tester.pumpAndSettle();
    
    // Assert
    expect(find.byType(DetailScreen), findsOneWidget);
  });
  
  // Testing with golden tests
  testWidgets('matches golden file', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: MyCustomWidget(),
      ),
    );
    
    await expectLater(
      find.byType(MyCustomWidget),
      matchesGoldenFile('goldens/my_custom_widget.png'),
    );
  });
}

// Testing custom widgets
void main() {
  testWidgets('CustomButton displays text and handles tap', 
      (WidgetTester tester) async {
    bool tapped = false;
    
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Click me',
            onPressed: () => tapped = true,
          ),
        ),
      ),
    );
    
    // Verify text is displayed
    expect(find.text('Click me'), findsOneWidget);
    
    // Tap the button
    await tester.tap(find.byType(CustomButton));
    await tester.pump();
    
    // Verify callback was called
    expect(tapped, isTrue);
  });
}
```

## Integration Testing

### Android Instrumented Tests

```kotlin
// Dependencies
androidTestImplementation("androidx.test.ext:junit:1.1.5")
androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
androidTestImplementation("androidx.compose.ui:ui-test-junit4:$compose_version")

@RunWith(AndroidJUnit4::class)
class TodoAppIntegrationTest {
    
    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()
    
    @Test
    fun addTodo_showsInList() {
        // Add a new todo
        composeTestRule
            .onNodeWithTag("add_todo_fab")
            .performClick()
            
        composeTestRule
            .onNodeWithTag("todo_title_field")
            .performTextInput("Buy groceries")
            
        composeTestRule
            .onNodeWithTag("save_todo_button")
            .performClick()
            
        // Verify todo appears in list
        composeTestRule
            .onNodeWithText("Buy groceries")
            .assertIsDisplayed()
    }
    
    @Test
    fun completeTodo_updatesUI() {
        // Complete a todo
        composeTestRule
            .onNodeWithTag("todo_checkbox_1")
            .performClick()
            
        // Verify UI updates
        composeTestRule
            .onNodeWithTag("todo_item_1")
            .assertTextContains("Completed")
    }
}

// Testing with real database
@RunWith(AndroidJUnit4::class)
class DatabaseIntegrationTest {
    
    private lateinit var database: AppDatabase
    private lateinit var userDao: UserDao
    
    @Before
    fun setup() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(
            context,
            AppDatabase::class.java
        ).build()
        userDao = database.userDao()
    }
    
    @After
    fun teardown() {
        database.close()
    }
    
    @Test
    fun userWithTodos_relationshipWorks() = runTest {
        // Insert user
        val user = UserEntity("1", "John", "john@example.com", Date())
        userDao.insertUser(user)
        
        // Insert todos
        val todoDao = database.todoDao()
        val todos = listOf(
            TodoEntity(title = "Todo 1", userId = "1"),
            TodoEntity(title = "Todo 2", userId = "1")
        )
        todos.forEach { todoDao.insertTodo(it) }
        
        // Query relationship
        todoDao.getUserWithTodos("1").test {
            val result = awaitItem()
            assertThat(result.user.id).isEqualTo("1")
            assertThat(result.todos).hasSize(2)
        }
    }
}
```

### Flutter Integration Testing

```dart
// integration_test/app_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('Todo App Integration Tests', () {
    testWidgets('add todo shows in list', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      
      // Add a new todo
      await tester.tap(find.byKey(Key('add_todo_fab')));
      await tester.pumpAndSettle();
      
      await tester.enterText(
        find.byKey(Key('todo_title_field')),
        'Buy groceries'
      );
      
      await tester.tap(find.byKey(Key('save_todo_button')));
      await tester.pumpAndSettle();
      
      // Verify todo appears in list
      expect(find.text('Buy groceries'), findsOneWidget);
    });
    
    testWidgets('complete todo updates UI', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();
      
      // Find and tap checkbox
      final checkbox = find.byKey(Key('todo_checkbox_1'));
      await tester.tap(checkbox);
      await tester.pumpAndSettle();
      
      // Verify UI updates
      expect(
        find.descendant(
          of: find.byKey(Key('todo_item_1')),
          matching: find.text('Completed'),
        ),
        findsOneWidget,
      );
    });
  });
  
  // Testing with real API
  testWidgets('fetches and displays users from API', 
      (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();
    
    // Navigate to users screen
    await tester.tap(find.byKey(Key('users_nav_item')));
    await tester.pumpAndSettle();
    
    // Wait for data to load
    await tester.pump(Duration(seconds: 2));
    
    // Verify users are displayed
    expect(find.byType(UserListItem), findsWidgets);
  });
}
```

## Test Coverage

### Android Coverage with JaCoCo

```kotlin
// build.gradle.kts
android {
    buildTypes {
        debug {
            enableUnitTestCoverage = true
            enableAndroidTestCoverage = true
        }
    }
}

tasks.register<JacocoReport>("jacocoTestReport") {
    dependsOn("testDebugUnitTest")
    
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
    
    sourceDirectories.setFrom(files("src/main/java"))
    classDirectories.setFrom(files("build/tmp/kotlin-classes/debug"))
    executionData.setFrom(files("build/jacoco/testDebugUnitTest.exec"))
}
```

### Flutter Coverage

```bash
# Run tests with coverage
flutter test --coverage

# Generate HTML report
genhtml coverage/lcov.info -o coverage/html

# View coverage report
open coverage/html/index.html

# Check coverage percentage
lcov --summary coverage/lcov.info
```

## Best Practices

### 1. Test Naming Convention

```kotlin
// Android
@Test
fun `methodName_stateUnderTest_expectedBehavior`() {
    // Test implementation
}

// Flutter
test('should return user when getUser is called with valid id', () {
    // Test implementation
});
```

### 2. Test Structure (AAA Pattern)

```kotlin
// Arrange - Set up test data
val user = User(id = "1", name = "Test")

// Act - Execute the function
val result = repository.getUser("1")

// Assert - Verify the result
assertThat(result).isEqualTo(user)
```

### 3. Mock Best Practices

```dart
// Flutter - Use mocktail for null safety
class MockRepository extends Mock implements UserRepository {}

// Set up default responses
setUpAll(() {
  registerFallbackValue(User(id: '', name: ''));
});

// Android - Use MockK for Kotlin
val mockRepository = mockk<UserRepository> {
  coEvery { getUser(any()) } returns testUser
}
```

### 4. Test Data Builders

```kotlin
// Android
object TestDataBuilder {
    fun buildUser(
        id: String = "1",
        name: String = "Test User",
        email: String = "test@example.com"
    ) = User(id, name, email)
}

// Flutter
class UserBuilder {
  String id = '1';
  String name = 'Test User';
  String email = 'test@example.com';
  
  User build() => User(id: id, name: name, email: email);
}
```

## Testing Checklist

- [ ] Unit tests for business logic
- [ ] Widget/UI tests for screens
- [ ] Integration tests for critical flows
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Mock external dependencies
- [ ] Maintain >80% code coverage
- [ ] Run tests in CI/CD pipeline
- [ ] Keep tests fast and isolated
- [ ] Update tests when changing code

## Summary

Testing in Android and Flutter:

**Similarities:**
- Both support unit, widget/UI, and integration testing
- Both have mocking frameworks
- Both can measure code coverage
- Both integrate with CI/CD

**Key Differences:**
- Android uses JUnit/Espresso, Flutter uses built-in test framework
- Android Compose tests are more type-safe
- Flutter's golden tests are easier to set up
- Android has better IDE integration for tests

**Best Practices:**
- Write tests first (TDD) when possible
- Focus on testing behavior, not implementation
- Keep tests simple and readable
- Use descriptive test names
- Maintain high code coverage

---

Previous: [Lesson 9: Persistence with Room](./lesson-9-persistence-room.md) | Next: [Lesson 11: Publishing Your App](./lesson-11-publishing.md)
