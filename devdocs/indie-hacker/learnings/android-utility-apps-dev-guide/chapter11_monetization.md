# Chapter 11: App Monetization

## AdMob Integration

### 1. Basic AdMob Setup
```kotlin
class AdManager @Inject constructor(
    private val context: Context,
    private val analyticsTracker: AnalyticsTracker
) {
    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null
    
    init {
        MobileAds.initialize(context) {
            loadAds()
        }
    }
    
    private fun loadAds() {
        loadInterstitialAd()
        loadRewardedAd()
    }
    
    private fun loadInterstitialAd() {
        InterstitialAd.load(
            context,
            BuildConfig.ADMOB_INTERSTITIAL_ID,
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    setupInterstitialCallbacks(ad)
                }
                
                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitialAd = null
                    analyticsTracker.trackAdError("interstitial", error)
                }
            }
        )
    }
    
    private fun setupInterstitialCallbacks(ad: InterstitialAd) {
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                interstitialAd = null
                loadInterstitialAd()
            }
            
            override fun onAdShowedFullScreenContent() {
                analyticsTracker.trackAdImpression("interstitial")
            }
        }
    }
    
    suspend fun showInterstitialAd(
        activity: Activity,
        frequency: AdFrequency
    ): Boolean = withContext(Dispatchers.Main) {
        if (!shouldShowAd(frequency)) {
            return@withContext false
        }
        
        try {
            interstitialAd?.show(activity)
            true
        } catch (e: Exception) {
            analyticsTracker.trackAdError("interstitial_show", e)
            false
        }
    }
    
    private fun shouldShowAd(frequency: AdFrequency): Boolean {
        return when (frequency) {
            AdFrequency.EVERY_N_ACTIONS -> checkActionCount()
            AdFrequency.TIME_BASED -> checkTimePassed()
            AdFrequency.EVENT_BASED -> true
        }
    }
}
```

### 2. Advanced Ad Implementation
```kotlin
class AIFeatureAdManager @Inject constructor(
    private val adManager: AdManager,
    private val userPreferences: UserPreferences,
    private val analyticsTracker: AnalyticsTracker
) {
    private val _adState = MutableStateFlow<AdState>(AdState.None)
    val adState: StateFlow<AdState> = _adState.asStateFlow()
    
    suspend fun showAdForFeature(
        activity: Activity,
        feature: AIFeature
    ): Boolean {
        if (userPreferences.isPremium) {
            return true
        }
        
        val adStrategy = determineAdStrategy(feature)
        return when (adStrategy) {
            is AdStrategy.Interstitial -> showInterstitialAd(activity)
            is AdStrategy.Rewarded -> showRewardedAd(activity)
            is AdStrategy.None -> true
        }
    }
    
    private fun determineAdStrategy(feature: AIFeature): AdStrategy {
        return when (feature) {
            AIFeature.BASIC_PROCESSING -> AdStrategy.None
            AIFeature.ADVANCED_PROCESSING -> AdStrategy.Interstitial(
                frequency = AdFrequency.EVERY_N_ACTIONS
            )
            AIFeature.PREMIUM_PROCESSING -> AdStrategy.Rewarded
        }
    }
    
    private suspend fun showInterstitialAd(activity: Activity): Boolean {
        _adState.value = AdState.Loading
        
        return try {
            val shown = adManager.showInterstitialAd(
                activity,
                AdFrequency.EVERY_N_ACTIONS
            )
            _adState.value = if (shown) AdState.Shown else AdState.Failed
            shown
        } catch (e: Exception) {
            _adState.value = AdState.Failed
            false
        }
    }
    
    sealed class AdState {
        object None : AdState()
        object Loading : AdState()
        object Shown : AdState()
        object Failed : AdState()
    }
    
    sealed class AdStrategy {
        data class Interstitial(val frequency: AdFrequency) : AdStrategy()
        object Rewarded : AdStrategy()
        object None : AdStrategy()
    }
}
```

## Alternative Revenue Models

### 1. Subscription Management
```kotlin
class SubscriptionManager @Inject constructor(
    private val billingClient: BillingClient,
    private val userPreferences: UserPreferences,
    private val analyticsTracker: AnalyticsTracker
) {
    private val _subscriptionState = MutableStateFlow<SubscriptionState>(SubscriptionState.Loading)
    val subscriptionState: StateFlow<SubscriptionState> = _subscriptionState.asStateFlow()
    
    init {
        setupBillingClient()
    }
    
    private fun setupBillingClient() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    querySubscriptions()
                } else {
                    _subscriptionState.value = SubscriptionState.Error(result.debugMessage)
                }
            }
            
            override fun onBillingServiceDisconnected() {
                _subscriptionState.value = SubscriptionState.Error("Billing service disconnected")
            }
        })
    }
    
    suspend fun purchaseSubscription(
        activity: Activity,
        subscriptionType: SubscriptionType
    ) {
        val flowParams = BillingFlowParams.newBuilder()
            .setProductId(subscriptionType.productId)
            .build()
        
        val response = billingClient.launchBillingFlow(activity, flowParams)
        handlePurchaseResponse(response)
    }
    
    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            acknowledgePurchase(purchase)
            updateSubscriptionState(purchase)
            analyticsTracker.trackPurchase(purchase)
        }
    }
    
    sealed class SubscriptionState {
        object Loading : SubscriptionState()
        data class Active(val type: SubscriptionType) : SubscriptionState()
        object Inactive : SubscriptionState()
        data class Error(val message: String) : SubscriptionState()
    }
    
    enum class SubscriptionType(val productId: String) {
        MONTHLY("ai_utility_monthly"),
        YEARLY("ai_utility_yearly"),
        LIFETIME("ai_utility_lifetime")
    }
}
```

### 2. In-App Purchases
```kotlin
class AIFeatureStore @Inject constructor(
    private val billingClient: BillingClient,
    private val userPreferences: UserPreferences
) {
    private val _features = MutableStateFlow<List<AIFeature>>(emptyList())
    val features: StateFlow<List<AIFeature>> = _features.asStateFlow()
    
    suspend fun purchaseFeature(
        activity: Activity,
        feature: AIFeature
    ): PurchaseResult = withContext(Dispatchers.Main) {
        try {
            val flowParams = BillingFlowParams.newBuilder()
                .setProductId(feature.productId)
                .build()
            
            val response = billingClient.launchBillingFlow(activity, flowParams)
            handlePurchaseResponse(response)
        } catch (e: Exception) {
            PurchaseResult.Error(e.message ?: "Unknown error")
        }
    }
    
    private suspend fun handlePurchaseResponse(response: BillingResult): PurchaseResult {
        return when (response.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                // Wait for purchase confirmation
                awaitPurchaseConfirmation()
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                PurchaseResult.Canceled
            }
            else -> {
                PurchaseResult.Error(response.debugMessage)
            }
        }
    }
    
    sealed class PurchaseResult {
        data class Success(val feature: AIFeature) : PurchaseResult()
        object Canceled : PurchaseResult()
        data class Error(val message: String) : PurchaseResult()
    }
}
```

## Monetization Strategy

### 1. Feature Gating
```kotlin
class FeatureGatekeeper @Inject constructor(
    private val subscriptionManager: SubscriptionManager,
    private val adManager: AdManager,
    private val userPreferences: UserPreferences
) {
    suspend fun canAccessFeature(
        feature: AIFeature,
        activity: Activity
    ): AccessResult {
        return when {
            userPreferences.isPremium -> AccessResult.Granted
            feature.requiresSubscription -> handleSubscriptionFeature(feature)
            feature.allowsAdAccess -> handleAdFeature(feature, activity)
            else -> AccessResult.Denied("Feature requires premium access")
        }
    }
    
    private suspend fun handleSubscriptionFeature(feature: AIFeature): AccessResult {
        return when (subscriptionManager.subscriptionState.first()) {
            is SubscriptionState.Active -> AccessResult.Granted
            else -> AccessResult.RequiresSubscription(feature.subscriptionType)
        }
    }
    
    private suspend fun handleAdFeature(
        feature: AIFeature,
        activity: Activity
    ): AccessResult {
        return if (adManager.showAdForFeature(activity, feature)) {
            AccessResult.Granted
        } else {
            AccessResult.RequiresAd
        }
    }
    
    sealed class AccessResult {
        object Granted : AccessResult()
        data class RequiresSubscription(val type: SubscriptionType) : AccessResult()
        object RequiresAd : AccessResult()
        data class Denied(val reason: String) : AccessResult()
    }
}
```

### 2. Revenue Analytics
```kotlin
class RevenueAnalytics @Inject constructor(
    private val analyticsTracker: AnalyticsTracker,
    private val userPreferences: UserPreferences
) {
    fun trackRevenue(event: RevenueEvent) {
        when (event) {
            is RevenueEvent.AdImpression -> trackAdImpression(event)
            is RevenueEvent.Purchase -> trackPurchase(event)
            is RevenueEvent.Subscription -> trackSubscription(event)
        }
    }
    
    private fun trackAdImpression(event: RevenueEvent.AdImpression) {
        analyticsTracker.logEvent("ad_impression") {
            param("ad_type", event.type)
            param("ad_placement", event.placement)
            param("revenue", event.revenue)
        }
    }
    
    private fun trackPurchase(event: RevenueEvent.Purchase) {
        analyticsTracker.logEvent("purchase") {
            param("product_id", event.productId)
            param("revenue", event.revenue)
            param("currency", event.currency)
        }
    }
    
    sealed class RevenueEvent {
        data class AdImpression(
            val type: String,
            val placement: String,
            val revenue: Double
        ) : RevenueEvent()
        
        data class Purchase(
            val productId: String,
            val revenue: Double,
            val currency: String
        ) : RevenueEvent()
        
        data class Subscription(
            val type: SubscriptionType,
            val revenue: Double,
            val currency: String
        ) : RevenueEvent()
    }
}
```

## User Experience

### 1. Premium Features UI
```kotlin
@Composable
fun PremiumFeaturesScreen(
    viewModel: PremiumFeaturesViewModel,
    modifier: Modifier = Modifier
) {
    val features by viewModel.features.collectAsState()
    val subscriptionState by viewModel.subscriptionState.collectAsState()
    
    Column(modifier = modifier.fillMaxSize()) {
        PremiumHeader()
        
        LazyColumn {
            items(features) { feature ->
                PremiumFeatureItem(
                    feature = feature,
                    isUnlocked = feature.isUnlocked(subscriptionState),
                    onPurchaseClick = { viewModel.purchaseFeature(feature) }
                )
            }
        }
        
        SubscriptionOptions(
            subscriptionState = subscriptionState,
            onSubscribe = { viewModel.subscribe(it) }
        )
    }
}

@Composable
private fun PremiumFeatureItem(
    feature: AIFeature,
    isUnlocked: Boolean,
    onPurchaseClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = feature.name,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = feature.description,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            
            if (!isUnlocked) {
                Button(onClick = onPurchaseClick) {
                    Text("Unlock")
                }
            } else {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = "Unlocked"
                )
            }
        }
    }
}
```

### 2. Ad Experience
```kotlin
@Composable
fun AdAwareFeature(
    feature: AIFeature,
    viewModel: AdAwareViewModel,
    modifier: Modifier = Modifier
) {
    val adState by viewModel.adState.collectAsState()
    
    Box(modifier = modifier) {
        when (adState) {
            is AdState.Loading -> {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            is AdState.Ready -> {
                FeatureContent(
                    feature = feature,
                    onAction = { viewModel.performAction() }
                )
            }
            is AdState.ShowingAd -> {
                // Ad is showing in full screen
            }
            is AdState.Error -> {
                ErrorMessage(
                    message = (adState as AdState.Error).message,
                    onRetry = { viewModel.retryAd() }
                )
            }
        }
    }
}
```

## Conclusion

Effective monetization of AI-powered Android apps requires:
1. Strategic AdMob integration
2. Well-designed subscription models
3. Balanced feature gating
4. Clear value proposition
5. Smooth user experience

Key considerations:
- Balance free and premium features
- Implement non-intrusive ads
- Offer valuable subscription benefits
- Track and analyze revenue metrics
- Maintain user satisfaction

Next chapter will cover Play Store optimization and app distribution strategies.
