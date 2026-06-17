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
```

### Basic Setup

```kotlin
// Data Models
data class User(
    val id: String,
    val name: String,
    val email: String,
    val avatarUrl: String?
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

// API Interface
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: String): User
    
    @GET("users")
    suspend fun getUsers(
        @Query("page") page: Int,
        @Query("limit") limit: Int = 20
    ): List<User>
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
    
    @PUT("users/{id}")
    suspend fun updateUser(
        @Path("id") userId: String,
        @Body user: User
    ): User
    
    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") userId: String): Response<Unit>
    
    @Multipart
    @POST("users/{id}/avatar")
    suspend fun uploadAvatar(
        @Path("id") userId: String,
        @Part avatar: MultipartBody.Part
    ): User
}

// Network Module (with Hilt)
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor())
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

### Interceptors

```kotlin
// Auth Interceptor
class AuthInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = getAuthToken() // Get from secure storage
        
        val request = chain.request().newBuilder()
            .apply {
                token?.let {
                    addHeader("Authorization", "Bearer $it")
                }
            }
            .build()
            
        return chain.proceed(request)
    }
}

// Error Interceptor
class ErrorInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val response = chain.proceed(chain.request())
        
        if (!response.isSuccessful) {
            when (response.code) {
                401 -> throw UnauthorizedException()
                403 -> throw ForbiddenException()
                404 -> throw NotFoundException()
                500 -> throw ServerErrorException()
            }
        }
        
        return response
    }
}
```

## Flutter: Dio Setup

### Dependencies

```yaml
# pubspec.yaml
dependencies:
  dio: ^5.3.2
  retrofit: ^4.0.1
  retrofit_generator: ^7.0.8
  json_annotation: ^4.8.1
  
dev_dependencies:
  build_runner: ^2.4.6
  json_serializable: ^6.7.1
```

### Basic Setup

```dart
// Data Models
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  
  User({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
  });
  
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

// API Client
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'api_client.g.dart';

@RestApi(baseUrl: "https://api.example.com/")
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;
  
  @GET("/users/{id}")
  Future<User> getUser(@Path("id") String userId);
  
  @GET("/users")
  Future<List<User>> getUsers(
    @Query("page") int page,
    [@Query("limit") int limit = 20],
  );
  
  @POST("/auth/login")
  Future<LoginResponse> login(@Body() LoginRequest request);
  
  @PUT("/users/{id}")
  Future<User> updateUser(
    @Path("id") String userId,
    @Body() User user,
  );
  
  @DELETE("/users/{id}")
  Future<void> deleteUser(@Path("id") String userId);
  
  @MultiPart()
  @POST("/users/{id}/avatar")
  Future<User> uploadAvatar(
    @Path("id") String userId,
    @Part() File avatar,
  );
}

// Dio Configuration
class NetworkService {
  late Dio _dio;
  late ApiClient _apiClient;
  
  NetworkService() {
    _dio = Dio(BaseOptions(
      connectTimeout: Duration(seconds: 30),
      receiveTimeout: Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    _dio.interceptors.addAll([
      AuthInterceptor(),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
      ),
    ]);
    
    _apiClient = ApiClient(_dio);
  }
  
  ApiClient get client => _apiClient;
}
```

### Flutter Interceptors

```dart
// Auth Interceptor
class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = getAuthToken(); // Get from secure storage
    
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    
    handler.next(options);
  }
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Handle token refresh
      refreshToken().then((newToken) {
        // Retry request with new token
        err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
        _dio.fetch(err.requestOptions).then(
          (response) => handler.resolve(response),
          onError: (error) => handler.reject(error),
        );
      }).catchError((error) {
        // Logout user
        handler.reject(err);
      });
    } else {
      handler.next(err);
    }
  }
}
```

## Making Network Requests

### Android with Coroutines

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {
    
    private val _userState = MutableStateFlow<UiState<User>>(UiState.Loading)
    val userState: StateFlow<UiState<User>> = _userState.asStateFlow()
    
    fun loadUser(userId: String) {
        viewModelScope.launch {
            _userState.value = UiState.Loading
            try {
                val user = apiService.getUser(userId)
                _userState.value = UiState.Success(user)
            } catch (e: Exception) {
                _userState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
    
    fun updateUser(user: User) {
        viewModelScope.launch {
            try {
                val updatedUser = apiService.updateUser(user.id, user)
                _userState.value = UiState.Success(updatedUser)
            } catch (e: HttpException) {
                when (e.code()) {
                    400 -> _userState.value = UiState.Error("Invalid data")
                    404 -> _userState.value = UiState.Error("User not found")
                    else -> _userState.value = UiState.Error("Server error")
                }
            } catch (e: IOException) {
                _userState.value = UiState.Error("Network error")
            }
        }
    }
}

// UI State
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}
```

### Flutter with FutureBuilder/StreamBuilder

```dart
class UserViewModel extends ChangeNotifier {
  final NetworkService _networkService;
  
  User? _user;
  User? get user => _user;
  
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  
  String? _error;
  String? get error => _error;
  
  UserViewModel(this._networkService);
  
  Future<void> loadUser(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _user = await _networkService.client.getUser(userId);
      _error = null;
    } on DioException catch (e) {
      if (e.response != null) {
        switch (e.response!.statusCode) {
          case 400:
            _error = 'Invalid request';
            break;
          case 404:
            _error = 'User not found';
            break;
          default:
            _error = 'Server error';
        }
      } else {
        _error = 'Network error';
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

// Using in Widget
class UserScreen extends StatelessWidget {
  final String userId;
  
  const UserScreen({required this.userId});
  
  @override
  Widget build(BuildContext context) {
    return Consumer<UserViewModel>(
      builder: (context, viewModel, child) {
        if (viewModel.isLoading) {
          return Center(child: CircularProgressIndicator());
        }
        
        if (viewModel.error != null) {
          return Center(child: Text('Error: ${viewModel.error}'));
        }
        
        final user = viewModel.user;
        if (user == null) {
          return Center(child: Text('No user data'));
        }
        
        return UserDetails(user: user);
      },
    );
  }
}
```

## File Upload

### Android

```kotlin
suspend fun uploadProfilePicture(userId: String, imageFile: File) {
    val requestFile = imageFile.asRequestBody("image/*".toMediaType())
    val body = MultipartBody.Part.createFormData("avatar", imageFile.name, requestFile)
    
    try {
        val updatedUser = apiService.uploadAvatar(userId, body)
        // Handle success
    } catch (e: Exception) {
        // Handle error
    }
}
```

### Flutter

```dart
Future<void> uploadProfilePicture(String userId, File imageFile) async {
  try {
    final formData = FormData.fromMap({
      'avatar': await MultipartFile.fromFile(
        imageFile.path,
        filename: imageFile.path.split('/').last,
      ),
    });
    
    final response = await dio.post(
      '/users/$userId/avatar',
      data: formData,
      onSendProgress: (sent, total) {
        print('Progress: ${(sent / total * 100).toStringAsFixed(0)}%');
      },
    );
    
    // Handle success
  } catch (e) {
    // Handle error
  }
}
```

## Caching Strategies

### Android with OkHttp Cache

```kotlin
@Provides
@Singleton
fun provideOkHttpClient(context: Context): OkHttpClient {
    val cacheSize = 10 * 1024 * 1024 // 10 MB
    val cache = Cache(context.cacheDir, cacheSize.toLong())
    
    return OkHttpClient.Builder()
        .cache(cache)
        .addNetworkInterceptor(CacheInterceptor())
        .build()
}

class CacheInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()
        
        request = if (hasNetwork())
            request.newBuilder()
                .header("Cache-Control", "public, max-age=" + 5)
                .build()
        else
            request.newBuilder()
                .header("Cache-Control", "public, only-if-cached, max-stale=" + 60 * 60 * 24 * 7)
                .build()
                
        return chain.proceed(request)
    }
}
```

### Flutter Cache Implementation

```dart
class CacheInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Check cache before making request
    final cachedResponse = getCachedResponse(options.uri.toString());
    
    if (cachedResponse != null && !isExpired(cachedResponse)) {
      handler.resolve(Response(
        requestOptions: options,
        data: cachedResponse.data,
      ));
    } else {
      handler.next(options);
    }
  }
  
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // Cache successful responses
    if (response.statusCode == 200) {
      cacheResponse(response.requestOptions.uri.toString(), response.data);
    }
    handler.next(response);
  }
}
```

## Testing Network Calls

### Android Testing

```kotlin
class ApiServiceTest {
    private lateinit var mockWebServer: MockWebServer
    private lateinit var apiService: ApiService
    
    @Before
    fun setup() {
        mockWebServer = MockWebServer()
        
        val retrofit = Retrofit.Builder()
            .baseUrl(mockWebServer.url("/"))
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            
        apiService = retrofit.create(ApiService::class.java)
    }
    
    @Test
    fun `getUser returns correct user`() = runTest {
        // Arrange
        val mockResponse = """
            {
                "id": "123",
                "name": "John Doe",
                "email": "john@example.com"
            }
        """.trimIndent()
        
        mockWebServer.enqueue(
            MockResponse()
                .setResponseCode(200)
                .setBody(mockResponse)
        )
        
        // Act
        val user = apiService.getUser("123")
        
        // Assert
        assertEquals("123", user.id)
        assertEquals("John Doe", user.name)
        assertEquals("john@example.com", user.email)
    }
    
    @After
    fun tearDown() {
        mockWebServer.shutdown()
    }
}
```

### Flutter Testing

```dart
void main() {
  group('ApiClient Tests', () {
    late Dio dio;
    late ApiClient apiClient;
    late DioAdapter dioAdapter;
    
    setUp(() {
      dio = Dio();
      dioAdapter = DioAdapter(dio: dio);
      apiClient = ApiClient(dio);
    });
    
    test('getUser returns correct user', () async {
      // Arrange
      const userId = '123';
      final userData = {
        'id': userId,
        'name': 'John Doe',
        'email': 'john@example.com',
      };
      
      dioAdapter.onGet(
        '/users/$userId',
        (server) => server.reply(200, userData),
      );
      
      // Act
      final user = await apiClient.getUser(userId);
      
      // Assert
      expect(user.id, equals(userId));
      expect(user.name, equals('John Doe'));
      expect(user.email, equals('john@example.com'));
    });
  });
}
```

## Best Practices

1. **Error Handling**
   - Always catch specific exceptions
   - Provide meaningful error messages to users
   - Implement retry logic for transient failures

2. **Security**
   - Never hardcode API keys
   - Use HTTPS for all communications
   - Implement certificate pinning for sensitive apps

3. **Performance**
   - Implement proper caching strategies
   - Use pagination for large data sets
   - Compress request/response payloads

4. **Architecture**
   - Separate network logic from UI
   - Use repository pattern
   - Mock network calls in tests

## Summary

Both Android's Retrofit and Flutter's Dio provide powerful networking capabilities:

**Android Strengths:**
- Type-safe API definitions
- Seamless coroutine integration
- Compile-time validation

**Flutter Strengths:**
- Flexible interceptor system
- Built-in progress tracking
- Easy multipart uploads

Choose patterns that fit your app's needs, but always prioritize:
- Clear error handling
- Proper state management
- Comprehensive testing
- Security best practices

---

Previous: [Lesson 7: Navigation](./lesson-7-navigation.md) | Next: [Lesson 9: Persistence with Room](./lesson-9-persistence-room.md)
