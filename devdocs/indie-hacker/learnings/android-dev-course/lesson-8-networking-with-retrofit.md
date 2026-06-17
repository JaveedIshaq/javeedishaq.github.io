# Lesson 8: Networking with Retrofit vs Flutter HTTP Libraries

## Overview

Networking is essential for modern mobile apps. Android developers typically use Retrofit for its type-safe API and seamless integration with Kotlin coroutines. Flutter developers often use Dio or the built-in http package. This lesson compares these approaches and demonstrates best practices for both platforms.

## Networking Libraries Comparison

| Feature | Flutter (Dio/http) | Android (Retrofit) |
|---------|-------------------|-------------------|
| Type Safety | Runtime | Compile-time |
| Interceptors | Yes | Yes (via OkHttp) |
| File Upload | Built-in | Multipart support |
| Caching | Manual | OkHttp cache |
| Coroutines/Async | Future/async-await | Suspend functions |
| JSON Parsing | Manual/json_serializable | Converters (Gson, Moshi) |

## Android: Retrofit Setup

### Dependencies

```kotlin
// build.gradle.kts (app module)
dependencies {
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")
    
    // Kotlin serialization (alternative to Gson)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.1")
    implementation("com.jakewharton.retrofit:retrofit2-kotlinx-serialization-converter:1.0.0")
}

### Creating a Retrofit Instance

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com")
    .addConverterFactory(GsonConverterFactory.create())
    .client(OkHttpClient.Builder().addInterceptor(HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }).build())
    .build()
```

### Define API Endpoints

```kotlin
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: String): User

    @POST("users/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest): LoginResponse
}

val apiService = retrofit.create(ApiService::class.java)
```

### Making Network Calls

Using Kotlin's coroutines:

```kotlin
viewModelScope.launch {
    try {
        val user = apiService.getUser("123")
        // Use the user object
    } catch (e: Exception) {
        // Handle error
    }
}
```

## Network Calls in Flutter with Dio

### Adding Dependencies

In `pubspec.yaml`:

```yaml
dependencies:
  dio: ^4.0.0
```

### Creating a Dio Instance

```dart
final dio = Dio(
  BaseOptions(
    baseUrl: 'https://api.example.com',
    connectTimeout: 5000,
    receiveTimeout: 3000,
  ),
)..interceptors.add(
  LogInterceptor(responseBody: true),
);
```

### Making Network Calls

```dart
void getUser() async {
  try {
    final response = await dio.get('/users/123');
    print(response.data);
  } catch (e) {
    print('Error: $e');
  }
}
```

## Error Handling

### Android

Leverage `try-catch` blocks and specific exceptions like `HttpException`:

```kotlin
try {
    val response = apiService.getUser("123")
} catch (e: HttpException) {
    // Handle HTTP exceptions
} catch (e: IOException) {
    // Handle network errors
}
```

### Flutter

Dio provides custom handling for HTTP errors:

```dart
try {
  var response = await dio.get('/users/123');
} on DioError catch (e) {
  if (e.response != null) {
    print('Error: ${e.response?.statusCode}');
  } else {
    print('Error sending request!');
  }
}
```

## Interceptors

Both Retrofit and Dio support interceptors for request and response manipulation.

### Retrofit

```kotlin
val logging = HttpLoggingInterceptor()
logging.setLevel(HttpLoggingInterceptor.Level.BODY)
val client = OkHttpClient.Builder()
    .addInterceptor(logging)
    .build()
```

### Dio

```dart
final dio = Dio()
  ..interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      // Do something before request is sent
      return handler.next(options);
    },
    onResponse: (response, handler) {
      // Do something with response data
      return handler.next(response);
    },
    onError: (DioError e, handler) {
      // Do something with response error
      return handler.next(e);
    },
  ));
```

## Best Practices

1. **Modularize API Definitions**: Group related endpoints in interfaces.
2. **Use Typed Models**: Ensure JSON parsing is reliable using models or DTOs.
3. **Error Handling**: Be specific in catching and handling exceptions.
4. **Interceptors**: Use them for logging, authentication, and error processing.
5. **Rate Limitation**: Be mindful of API usage, especially in production apps.

## Testing Networking

### Android

Use MockWebServer for testing HTTP calls:

```kotlin
val server = MockWebServer()

@Test
fun testGetUser() {
    server.enqueue(MockResponse().setBody("{"id":"123","name":"John"}"))
    val response = runBlocking {
        apiService.getUser("123")
    }
    assertEquals("John", response.name)
}
```

### Flutter

Using package `dio_http2_adapter` for mocking:

```dart
test('Get user test', () async {
  final dio = Dio()
    ..httpClientAdapter = MockAdapter();
  
  // Simulate a network call
  (dio.httpClientAdapter as MockAdapter).onGet('/users/123', (server) {
    return server.reply(200, {"id": "123", "name": "John"});
  });

  final response = await dio.get('/users/123');
  expect(response.data['name'], 'John');
});
```

## Summary

Networking in Android and Flutter requires understanding different tools and patterns. Retrofit's type-safe API and Dio's flexibility provide robust solutions for handling network tasks, data parsing, and error management.

Ensure you apply best practices, including modular design and proper error handling, regardless of the platform.

---

Previous: [Lesson 7: Navigation](./lesson-7-navigation.md) | Next: [Lesson 9: Persistence with Room](./lesson-9-persistence-with-room.md)
