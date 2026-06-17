# Chapter 9: Security and Privacy

## Data Protection

### 1. Secure Data Storage
```kotlin
class SecureStorage @Inject constructor(
    private val context: Context,
    private val encryptionManager: EncryptionManager
) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val encryptedSharedPreferences = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    suspend fun securelyStoreData(
        key: String,
        data: ByteArray
    ) = withContext(Dispatchers.IO) {
        val encryptedData = encryptionManager.encrypt(data)
        val encodedData = Base64.encodeToString(encryptedData, Base64.DEFAULT)
        encryptedSharedPreferences.edit().putString(key, encodedData).apply()
    }
    
    suspend fun retrieveSecureData(key: String): ByteArray? = withContext(Dispatchers.IO) {
        encryptedSharedPreferences.getString(key, null)?.let { encodedData ->
            val encryptedData = Base64.decode(encodedData, Base64.DEFAULT)
            encryptionManager.decrypt(encryptedData)
        }
    }
}
```

### 2. Encryption Manager
```kotlin
class EncryptionManager @Inject constructor(
    private val context: Context
) {
    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply {
        load(null)
    }
    
    private fun getOrCreateKey(alias: String): SecretKey {
        return if (keyStore.containsAlias(alias)) {
            (keyStore.getEntry(alias, null) as KeyStore.SecretKeyEntry).secretKey
        } else {
            generateKey(alias)
        }
    }
    
    private fun generateKey(alias: String): SecretKey {
        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )
        
        val keyGenParameterSpec = KeyGenParameterSpec.Builder(
            alias,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .setUserAuthenticationRequired(false)
            .build()
        
        keyGenerator.init(keyGenParameterSpec)
        return keyGenerator.generateKey()
    }
    
    fun encrypt(data: ByteArray): ByteArray {
        val key = getOrCreateKey(KEY_ALIAS)
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, key)
        
        val encryptedData = cipher.doFinal(data)
        val combined = ByteArray(cipher.iv.size + encryptedData.size)
        
        System.arraycopy(cipher.iv, 0, combined, 0, cipher.iv.size)
        System.arraycopy(encryptedData, 0, combined, cipher.iv.size, encryptedData.size)
        
        return combined
    }
    
    fun decrypt(encryptedData: ByteArray): ByteArray {
        val key = getOrCreateKey(KEY_ALIAS)
        val cipher = Cipher.getInstance(TRANSFORMATION)
        
        val iv = encryptedData.sliceArray(0 until IV_LENGTH)
        val encrypted = encryptedData.sliceArray(IV_LENGTH until encryptedData.size)
        
        cipher.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(128, iv))
        return cipher.doFinal(encrypted)
    }
    
    companion object {
        private const val KEY_ALIAS = "ai_utility_key"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val IV_LENGTH = 12
    }
}
```

## Model Security

### 1. Model Protection
```kotlin
class ModelProtector @Inject constructor(
    private val context: Context,
    private val encryptionManager: EncryptionManager
) {
    suspend fun secureModel(
        modelPath: String,
        outputPath: String
    ) = withContext(Dispatchers.IO) {
        val modelData = context.assets.open(modelPath).use { it.readBytes() }
        val encryptedModel = encryptionManager.encrypt(modelData)
        
        File(outputPath).outputStream().use {
            it.write(encryptedModel)
        }
    }
    
    suspend fun loadSecureModel(modelPath: String): ByteBuffer = withContext(Dispatchers.IO) {
        val encryptedModel = File(modelPath).readBytes()
        val decryptedModel = encryptionManager.decrypt(encryptedModel)
        ByteBuffer.wrap(decryptedModel)
    }
    
    fun validateModelIntegrity(modelData: ByteArray, signature: String): Boolean {
        val calculatedHash = MessageDigest.getInstance("SHA-256")
            .digest(modelData)
            .fold("") { str, byte -> str + "%02x".format(byte) }
        
        return calculatedHash == signature
    }
}
```

### 2. Secure Model Loading
```kotlin
class SecureModelManager @Inject constructor(
    private val modelProtector: ModelProtector,
    private val secureStorage: SecureStorage
) {
    private val loadedModels = ConcurrentHashMap<String, Model>()
    
    suspend fun loadModel(
        modelPath: String,
        signature: String
    ): Model = withContext(Dispatchers.IO) {
        loadedModels.getOrPut(modelPath) {
            val modelBuffer = modelProtector.loadSecureModel(modelPath)
            
            if (!modelProtector.validateModelIntegrity(modelBuffer.array(), signature)) {
                throw SecurityException("Model integrity check failed")
            }
            
            Model.create(modelBuffer)
        }
    }
    
    fun unloadModel(modelPath: String) {
        loadedModels[modelPath]?.close()
        loadedModels.remove(modelPath)
    }
}
```

## User Privacy

### 1. Privacy Manager
```kotlin
class PrivacyManager @Inject constructor(
    private val context: Context,
    private val secureStorage: SecureStorage
) {
    private val privacySettings = MutableStateFlow(PrivacySettings())
    
    suspend fun updatePrivacySettings(settings: PrivacySettings) {
        secureStorage.securelyStoreData(
            PRIVACY_SETTINGS_KEY,
            settings.toJson().toByteArray()
        )
        privacySettings.value = settings
    }
    
    fun getPrivacySettings(): Flow<PrivacySettings> = privacySettings.asStateFlow()
    
    suspend fun clearUserData() = withContext(Dispatchers.IO) {
        context.cacheDir.deleteRecursively()
        context.filesDir.listFiles()?.forEach { file ->
            if (!file.name.startsWith("model_")) {
                file.deleteRecursively()
            }
        }
        // Clear secure storage except for essential settings
        secureStorage.clearAllExcept(listOf(PRIVACY_SETTINGS_KEY))
    }
    
    data class PrivacySettings(
        val dataCollection: Boolean = false,
        val analytics: Boolean = false,
        val modelImprovement: Boolean = false,
        val retentionPeriod: Int = 30 // days
    )
    
    companion object {
        private const val PRIVACY_SETTINGS_KEY = "privacy_settings"
    }
}
```

### 2. Data Anonymization
```kotlin
class DataAnonymizer @Inject constructor() {
    fun anonymizeUserData(data: UserData): AnonymizedData {
        return AnonymizedData(
            id = hashId(data.id),
            attributes = data.attributes.mapValues { (key, value) ->
                when {
                    isPersonalData(key) -> hashValue(value)
                    isLocationData(key) -> fuzzyLocation(value)
                    else -> value
                }
            }
        )
    }
    
    private fun hashId(id: String): String {
        return MessageDigest.getInstance("SHA-256")
            .digest(id.toByteArray())
            .fold("") { str, byte -> str + "%02x".format(byte) }
    }
    
    private fun fuzzyLocation(location: String): String {
        // Reduce location precision to city level
        return location.split(",")
            .map { coordinate ->
                coordinate.toDoubleOrNull()?.let { 
                    String.format("%.1f", it)
                } ?: coordinate
            }
            .joinToString(",")
    }
}
```

## Compliance Requirements

### 1. GDPR Compliance
```kotlin
class GDPRCompliance @Inject constructor(
    private val privacyManager: PrivacyManager,
    private val dataAnonymizer: DataAnonymizer
) {
    suspend fun handleDataRequest(
        request: DataRequest
    ): DataResponse = withContext(Dispatchers.IO) {
        when (request) {
            is DataRequest.Access -> {
                val userData = getUserData(request.userId)
                DataResponse.Success(userData)
            }
            is DataRequest.Deletion -> {
                deleteUserData(request.userId)
                DataResponse.Success(null)
            }
            is DataRequest.Export -> {
                val userData = getUserData(request.userId)
                val exportFormat = exportUserData(userData)
                DataResponse.Success(exportFormat)
            }
        }
    }
    
    suspend fun ensureConsent(
        userId: String,
        consentType: ConsentType
    ): Boolean {
        val consent = getStoredConsent(userId, consentType)
        return consent?.isValid == true
    }
    
    data class Consent(
        val userId: String,
        val type: ConsentType,
        val timestamp: Instant,
        val expirationDate: Instant?
    ) {
        val isValid: Boolean
            get() = expirationDate?.let { it > Clock.System.now() } ?: true
    }
    
    enum class ConsentType {
        DATA_COLLECTION,
        ANALYTICS,
        MARKETING,
        MODEL_IMPROVEMENT
    }
}
```

### 2. Data Retention
```kotlin
class DataRetentionManager @Inject constructor(
    private val privacyManager: PrivacyManager,
    private val secureStorage: SecureStorage
) {
    private val retentionScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    
    init {
        startRetentionCheck()
    }
    
    private fun startRetentionCheck() {
        retentionScope.launch {
            while (isActive) {
                checkAndCleanExpiredData()
                delay(24.hours)
            }
        }
    }
    
    private suspend fun checkAndCleanExpiredData() {
        val settings = privacyManager.getPrivacySettings().first()
        val retentionPeriod = settings.retentionPeriod.days
        
        val now = Clock.System.now()
        val expirationDate = now - retentionPeriod
        
        cleanExpiredData(expirationDate)
    }
    
    private suspend fun cleanExpiredData(expirationDate: Instant) {
        // Clean local files
        context.filesDir.listFiles()?.forEach { file ->
            val lastModified = Instant.fromEpochMilliseconds(file.lastModified())
            if (lastModified < expirationDate) {
                file.delete()
            }
        }
        
        // Clean secure storage
        secureStorage.removeExpiredData(expirationDate)
    }
}
```

## Security Auditing

### 1. Security Logger
```kotlin
class SecurityLogger @Inject constructor(
    private val context: Context
) {
    private val securityEvents = Channel<SecurityEvent>(Channel.UNLIMITED)
    
    init {
        CoroutineScope(Dispatchers.IO).launch {
            processSecurityEvents()
        }
    }
    
    suspend fun logSecurityEvent(event: SecurityEvent) {
        securityEvents.send(event)
    }
    
    private suspend fun processSecurityEvents() {
        for (event in securityEvents) {
            val logEntry = createLogEntry(event)
            writeLogToFile(logEntry)
            
            if (event.severity >= SecurityEvent.Severity.HIGH) {
                notifySecurityAdmin(event)
            }
        }
    }
    
    data class SecurityEvent(
        val type: EventType,
        val description: String,
        val severity: Severity,
        val timestamp: Instant = Clock.System.now()
    ) {
        enum class EventType {
            UNAUTHORIZED_ACCESS,
            MODEL_TAMPERING,
            DATA_LEAK,
            PRIVACY_VIOLATION
        }
        
        enum class Severity {
            LOW, MEDIUM, HIGH, CRITICAL
        }
    }
}
```

### 2. Security Monitoring
```kotlin
class SecurityMonitor @Inject constructor(
    private val securityLogger: SecurityLogger,
    private val modelProtector: ModelProtector
) {
    private val monitoringScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    
    fun startMonitoring() {
        monitoringScope.launch {
            while (isActive) {
                performSecurityCheck()
                delay(1.hours)
            }
        }
    }
    
    private suspend fun performSecurityCheck() {
        checkRootAccess()
        checkEmulator()
        checkDebugger()
        checkModelIntegrity()
        checkSystemSecurity()
    }
    
    private suspend fun checkModelIntegrity() {
        val models = loadModelList()
        models.forEach { model ->
            if (!modelProtector.validateModelIntegrity(model.data, model.signature)) {
                securityLogger.logSecurityEvent(
                    SecurityEvent(
                        type = SecurityEvent.EventType.MODEL_TAMPERING,
                        description = "Model integrity check failed for ${model.name}",
                        severity = SecurityEvent.Severity.HIGH
                    )
                )
            }
        }
    }
}
```

## Conclusion

Implementing security and privacy in AI-powered Android apps requires:
1. Secure data storage and encryption
2. Model protection and integrity validation
3. User privacy management
4. GDPR compliance
5. Security monitoring and auditing

Key considerations:
- Use strong encryption for sensitive data
- Protect AI models from tampering
- Implement proper data anonymization
- Ensure regulatory compliance
- Monitor and log security events

Next chapter will cover testing and quality assurance for AI-powered Android apps.
