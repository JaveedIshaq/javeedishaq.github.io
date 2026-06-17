# Lesson 9: Persistence - Room Database vs Flutter's Options

## Overview

Data persistence is crucial for mobile apps. Android's Room provides an abstraction layer over SQLite with compile-time verification of SQL queries. Flutter developers have several options including sqflite, Drift (formerly Moor), and Hive. This lesson compares these approaches and demonstrates best practices.

## Database Solutions Comparison

| Feature | Flutter (sqflite/Drift/Hive) | Android (Room) |
|---------|------------------------------|----------------|
| Type Safety | Runtime (sqflite) / Compile-time (Drift) | Compile-time |
| Query Language | Raw SQL / Dart (Drift) | SQL with annotations |
| Migrations | Manual | Automated support |
| Relations | Manual joins | @Relation annotation |
| Reactive Queries | Streams (all) | Flow/LiveData |
| NoSQL Option | Hive | DataStore |

## Android: Room Database Setup

### Dependencies

```kotlin
// build.gradle.kts (app module)
dependencies {
    val roomVersion = "2.6.1"
    
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")
    
    // Optional - Paging support
    implementation("androidx.room:room-paging:$roomVersion")
    
    // Test helpers
    testImplementation("androidx.room:room-testing:$roomVersion")
}
```

### Entity Definition

```kotlin
import androidx.room.*
import java.util.Date

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val email: String,
    @ColumnInfo(name = "created_at")
    val createdAt: Date,
    @ColumnInfo(name = "is_active")
    val isActive: Boolean = true
)

@Entity(
    tableName = "todos",
    foreignKeys = [
        ForeignKey(
            entity = UserEntity::class,
            parentColumns = ["id"],
            childColumns = ["user_id"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("user_id")]
)
data class TodoEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String?,
    @ColumnInfo(name = "user_id")
    val userId: String,
    @ColumnInfo(name = "is_completed")
    val isCompleted: Boolean = false,
    @ColumnInfo(name = "created_at")
    val createdAt: Date = Date(),
    @ColumnInfo(name = "due_date")
    val dueDate: Date?
)

// Relationship classes
data class UserWithTodos(
    @Embedded val user: UserEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "user_id"
    )
    val todos: List<TodoEntity>
)
```

### DAO (Data Access Object)

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getUser(userId: String): UserEntity?
    
    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): UserEntity?
    
    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<UserEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)
    
    @Update
    suspend fun updateUser(user: UserEntity)
    
    @Delete
    suspend fun deleteUser(user: UserEntity)
    
    @Query("DELETE FROM users")
    suspend fun deleteAllUsers()
}

@Dao
interface TodoDao {
    @Query("SELECT * FROM todos WHERE user_id = :userId ORDER BY created_at DESC")
    fun getTodosByUser(userId: String): Flow<List<TodoEntity>>
    
    @Query("SELECT * FROM todos WHERE id = :todoId")
    suspend fun getTodo(todoId: Long): TodoEntity?
    
    @Query("""
        SELECT * FROM todos 
        WHERE user_id = :userId 
        AND is_completed = :isCompleted
        ORDER BY due_date ASC
    """)
    fun getTodosByStatus(
        userId: String, 
        isCompleted: Boolean
    ): Flow<List<TodoEntity>>
    
    @Insert
    suspend fun insertTodo(todo: TodoEntity): Long
    
    @Insert
    suspend fun insertTodos(todos: List<TodoEntity>)
    
    @Update
    suspend fun updateTodo(todo: TodoEntity)
    
    @Query("UPDATE todos SET is_completed = :isCompleted WHERE id = :todoId")
    suspend fun updateTodoStatus(todoId: Long, isCompleted: Boolean)
    
    @Delete
    suspend fun deleteTodo(todo: TodoEntity)
    
    @Transaction
    @Query("SELECT * FROM users WHERE id = :userId")
    fun getUserWithTodos(userId: String): Flow<UserWithTodos>
}
```

### Type Converters

```kotlin
@TypeConverters
class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time
    }
    
    @TypeConverter
    fun fromStringList(value: String): List<String> {
        return value.split(",").map { it.trim() }
    }
    
    @TypeConverter
    fun fromListString(list: List<String>): String {
        return list.joinToString(",")
    }
}
```

### Database Class

```kotlin
@Database(
    entities = [UserEntity::class, TodoEntity::class],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun todoDao(): TodoDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

// Dependency Injection with Hilt
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "app_database"
        ).build()
    }
    
    @Provides
    fun provideUserDao(database: AppDatabase): UserDao = database.userDao()
    
    @Provides
    fun provideTodoDao(database: AppDatabase): TodoDao = database.todoDao()
}
```

### Migrations

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL("ALTER TABLE todos ADD COLUMN priority INTEGER NOT NULL DEFAULT 0")
    }
}

val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(database: SupportSQLiteDatabase) {
        // Create new table with tags
        database.execSQL("""
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,
                color TEXT NOT NULL
            )
        """)
        
        // Create junction table for many-to-many relationship
        database.execSQL("""
            CREATE TABLE IF NOT EXISTS todo_tags (
                todo_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                PRIMARY KEY(todo_id, tag_id),
                FOREIGN KEY(todo_id) REFERENCES todos(id) ON DELETE CASCADE,
                FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        """)
    }
}

// Add migrations to database builder
Room.databaseBuilder(context, AppDatabase::class.java, "app_database")
    .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
    .build()
```

## Flutter: Database Options

### 1. Sqflite (SQL Database)

```yaml
# pubspec.yaml
dependencies:
  sqflite: ^2.3.0
  path: ^1.8.3
```

```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

// Entity Models
class User {
  final String id;
  final String name;
  final String email;
  final DateTime createdAt;
  final bool isActive;
  
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
    this.isActive = true,
  });
  
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'created_at': createdAt.millisecondsSinceEpoch,
      'is_active': isActive ? 1 : 0,
    };
  }
  
  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'],
      name: map['name'],
      email: map['email'],
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      isActive: map['is_active'] == 1,
    );
  }
}

// Database Helper
class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  factory DatabaseHelper() => _instance;
  DatabaseHelper._internal();
  
  static Database? _database;
  
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }
  
  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'app_database.db');
    
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }
  
  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1
      )
    ''');
    
    await db.execute('''
      CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        user_id TEXT NOT NULL,
        is_completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        due_date INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    ''');
  }
  
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute('ALTER TABLE todos ADD COLUMN priority INTEGER DEFAULT 0');
    }
  }
  
  // User operations
  Future<void> insertUser(User user) async {
    final db = await database;
    await db.insert('users', user.toMap());
  }
  
  Future<User?> getUser(String id) async {
    final db = await database;
    final maps = await db.query(
      'users',
      where: 'id = ?',
      whereArgs: [id],
    );
    
    if (maps.isEmpty) return null;
    return User.fromMap(maps.first);
  }
  
  Stream<List<User>> watchAllUsers() async* {
    // Sqflite doesn't have built-in reactive queries
    // You need to manually emit updates
    while (true) {
      final db = await database;
      final maps = await db.query('users');
      yield maps.map((map) => User.fromMap(map)).toList();
      await Future.delayed(Duration(seconds: 1)); // Poll interval
    }
  }
}
```

### 2. Drift (Type-Safe SQL)

```yaml
# pubspec.yaml
dependencies:
  drift: ^2.13.0
  sqlite3_flutter_libs: ^0.5.0
  
dev_dependencies:
  drift_dev: ^2.13.0
  build_runner: ^2.4.0
```

```dart
import 'package:drift/drift.dart';
import 'package:drift/native.dart';

part 'database.g.dart';

// Tables
class Users extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get email => text()();
  DateTimeColumn get createdAt => dateTime()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  
  @override
  Set<Column> get primaryKey => {id};
}

class Todos extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  TextColumn get description => text().nullable()();
  TextColumn get userId => text().references(Users, #id)();
  BoolColumn get isCompleted => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get dueDate => dateTime().nullable()();
}

// Database
@DriftDatabase(tables: [Users, Todos])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(NativeDatabase.memory());
  
  @override
  int get schemaVersion => 1;
  
  // User queries
  Future<User?> getUserById(String id) {
    return (select(users)..where((u) => u.id.equals(id))).getSingleOrNull();
  }
  
  Stream<List<User>> watchAllUsers() {
    return select(users).watch();
  }
  
  Future<void> insertUser(UsersCompanion user) {
    return into(users).insert(user);
  }
  
  // Todo queries with joins
  Stream<List<TodoWithUser>> watchTodosWithUser() {
    final query = select(todos).join([
      leftOuterJoin(users, users.id.equalsExp(todos.userId)),
    ]);
    
    return query.watch().map((rows) {
      return rows.map((row) {
        return TodoWithUser(
          todo: row.readTable(todos),
          user: row.readTable(users),
        );
      }).toList();
    });
  }
  
  // Complex queries
  Stream<List<Todo>> watchIncompleteTodosByUser(String userId) {
    return (select(todos)
      ..where((t) => t.userId.equals(userId) & t.isCompleted.equals(false))
      ..orderBy([
        (t) => OrderingTerm(expression: t.dueDate, mode: OrderingMode.asc),
      ])).watch();
  }
}

// Data class for joins
class TodoWithUser {
  final Todo todo;
  final User user;
  
  TodoWithUser({required this.todo, required this.user});
}
```

### 3. Hive (NoSQL)

```yaml
# pubspec.yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
dev_dependencies:
  hive_generator: ^2.0.0
  build_runner: ^2.4.0
```

```dart
import 'package:hive/hive.dart';

part 'user.g.dart';

@HiveType(typeId: 0)
class User extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String email;
  
  @HiveField(3)
  final DateTime createdAt;
  
  @HiveField(4)
  final bool isActive;
  
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
    this.isActive = true,
  });
}

// Database Service
class HiveService {
  static const String userBoxName = 'users';
  static const String todoBoxName = 'todos';
  
  static Future<void> init() async {
    await Hive.initFlutter();
    Hive.registerAdapter(UserAdapter());
    Hive.registerAdapter(TodoAdapter());
    
    await Hive.openBox<User>(userBoxName);
    await Hive.openBox<Todo>(todoBoxName);
  }
  
  Box<User> get userBox => Hive.box<User>(userBoxName);
  Box<Todo> get todoBox => Hive.box<Todo>(todoBoxName);
  
  // User operations
  Future<void> saveUser(User user) async {
    await userBox.put(user.id, user);
  }
  
  User? getUser(String id) {
    return userBox.get(id);
  }
  
  Stream<BoxEvent> watchUser(String id) {
    return userBox.watch(key: id);
  }
  
  List<User> getAllUsers() {
    return userBox.values.toList();
  }
  
  // Complex queries with Hive
  List<Todo> getTodosByUser(String userId) {
    return todoBox.values
        .where((todo) => todo.userId == userId)
        .toList();
  }
  
  Stream<List<Todo>> watchTodosByUser(String userId) {
    return todoBox.watch().map((event) {
      return todoBox.values
          .where((todo) => todo.userId == userId)
          .toList();
    });
  }
}
```

## Repository Pattern Implementation

### Android Repository

```kotlin
interface UserRepository {
    suspend fun getUser(userId: String): User?
    fun getAllUsers(): Flow<List<User>>
    suspend fun saveUser(user: User)
    suspend fun deleteUser(userId: String)
}

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val userDao: UserDao,
    private val apiService: ApiService
) : UserRepository {
    
    override suspend fun getUser(userId: String): User? {
        // Try local first
        val localUser = userDao.getUser(userId)?.toDomainModel()
        if (localUser != null) return localUser
        
        // Fetch from network
        return try {
            val remoteUser = apiService.getUser(userId)
            userDao.insertUser(remoteUser.toEntity())
            remoteUser
        } catch (e: Exception) {
            null
        }
    }
    
    override fun getAllUsers(): Flow<List<User>> {
        return userDao.getAllUsers().map { entities ->
            entities.map { it.toDomainModel() }
        }
    }
    
    override suspend fun saveUser(user: User) {
        userDao.insertUser(user.toEntity())
        
        // Sync with server
        try {
            apiService.updateUser(user.id, user)
        } catch (e: Exception) {
            // Handle sync error
        }
    }
    
    override suspend fun deleteUser(userId: String) {
        userDao.deleteUser(userDao.getUser(userId) ?: return)
    }
}

// Extension functions for mapping
fun UserEntity.toDomainModel(): User {
    return User(
        id = id,
        name = name,
        email = email,
        createdAt = createdAt,
        isActive = isActive
    )
}

fun User.toEntity(): UserEntity {
    return UserEntity(
        id = id,
        name = name,
        email = email,
        createdAt = createdAt,
        isActive = isActive
    )
}
```

### Flutter Repository

```dart
abstract class UserRepository {
  Future<User?> getUser(String userId);
  Stream<List<User>> watchAllUsers();
  Future<void> saveUser(User user);
  Future<void> deleteUser(String userId);
}

class UserRepositoryImpl implements UserRepository {
  final DatabaseHelper _databaseHelper;
  final ApiClient _apiClient;
  
  UserRepositoryImpl(this._databaseHelper, this._apiClient);
  
  @override
  Future<User?> getUser(String userId) async {
    // Try local first
    final localUser = await _databaseHelper.getUser(userId);
    if (localUser != null) return localUser;
    
    // Fetch from network
    try {
      final remoteUser = await _apiClient.getUser(userId);
      await _databaseHelper.insertUser(remoteUser);
      return remoteUser;
    } catch (e) {
      return null;
    }
  }
  
  @override
  Stream<List<User>> watchAllUsers() {
    return _databaseHelper.watchAllUsers();
  }
  
  @override
  Future<void> saveUser(User user) async {
    await _databaseHelper.insertUser(user);
    
    // Sync with server
    try {
      await _apiClient.updateUser(user.id, user);
    } catch (e) {
      // Handle sync error
    }
  }
  
  @override
  Future<void> deleteUser(String userId) async {
    await _databaseHelper.deleteUser(userId);
  }
}
```

## Testing Databases

### Android Room Testing

```kotlin
@RunWith(AndroidJUnit4::class)
class UserDaoTest {
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
    fun insertAndGetUser() = runTest {
        // Arrange
        val user = UserEntity(
            id = "123",
            name = "John Doe",
            email = "john@example.com",
            createdAt = Date()
        )
        
        // Act
        userDao.insertUser(user)
        val retrieved = userDao.getUser("123")
        
        // Assert
        assertThat(retrieved).isNotNull()
        assertThat(retrieved?.name).isEqualTo("John Doe")
    }
    
    @Test
    fun getAllUsersFlow() = runTest {
        // Arrange
        val users = listOf(
            UserEntity("1", "User 1", "user1@example.com", Date()),
            UserEntity("2", "User 2", "user2@example.com", Date())
        )
        
        // Act
        users.forEach { userDao.insertUser(it) }
        
        // Assert
        userDao.getAllUsers().test {
            val list = awaitItem()
            assertThat(list).hasSize(2)
            cancel()
        }
    }
}
```

### Flutter Testing

```dart
void main() {
  late DatabaseHelper databaseHelper;
  
  setUp(() async {
    // Use in-memory database for tests
    databaseHelper = DatabaseHelper();
    await databaseHelper.database;
  });
  
  tearDown(() async {
    final db = await databaseHelper.database;
    await db.close();
  });
  
  group('UserDao Tests', () {
    test('insert and get user', () async {
      // Arrange
      final user = User(
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: DateTime.now(),
      );
      
      // Act
      await databaseHelper.insertUser(user);
      final retrieved = await databaseHelper.getUser('123');
      
      // Assert
      expect(retrieved, isNotNull);
      expect(retrieved!.name, equals('John Doe'));
    });
  });
}
```

## Best Practices

1. **Use Repository Pattern**
   - Abstract database implementation from business logic
   - Easy to swap implementations
   - Simplifies testing

2. **Handle Migrations Carefully**
   - Always backup before migrations
   - Test migrations thoroughly
   - Provide fallback strategies

3. **Optimize Queries**
   - Use indexes for frequently queried columns
   - Avoid N+1 queries with proper joins
   - Use pagination for large datasets

4. **Data Synchronization**
   - Implement offline-first architecture
   - Handle conflicts gracefully
   - Use timestamps for sync logic

## Summary

Database persistence in Android and Flutter:

**Room (Android):**
- Type-safe queries
- Built-in migration support
- Reactive queries with Flow
- Compile-time verification

**Flutter Options:**
- Sqflite: Raw SQL, manual migrations
- Drift: Type-safe, reactive queries
- Hive: NoSQL, fast, no migrations

Choose based on your needs:
- Complex relational data: Room/Drift
- Simple key-value storage: DataStore/Hive
- Cross-platform consistency: Consider Drift

---

Previous: [Lesson 8: Networking](./lesson-8-networking.md) | Next: [Lesson 10: Testing](./lesson-10-testing.md)
