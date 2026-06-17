# Chapter 6: UI/UX Design for AI Apps

## Material Design 3 Implementation

### 1. Theme Configuration
```kotlin
@Composable
fun AIUtilityTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        shapes = AppShapes,
        content = content
    )
}
```

### 2. Custom Components
```kotlin
@Composable
fun AIProcessingCard(
    title: String,
    confidence: Float,
    isProcessing: Boolean,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium
            )
            
            LinearProgressIndicator(
                progress = confidence,
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.primary
            )
            
            if (isProcessing) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
            }
            
            Button(
                onClick = onRetry,
                enabled = !isProcessing,
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("Retry")
            }
        }
    }
}
```

## Responsive Layouts

### 1. Adaptive Layout System
```kotlin
@Composable
fun AdaptiveLayout(
    content: @Composable (WindowSizeClass) -> Unit
) {
    val configuration = LocalConfiguration.current
    val windowSizeClass = when {
        configuration.screenWidthDp < 600 -> WindowSizeClass.COMPACT
        configuration.screenWidthDp < 840 -> WindowSizeClass.MEDIUM
        else -> WindowSizeClass.EXPANDED
    }
    
    content(windowSizeClass)
}

@Composable
fun AIProcessingScreen() {
    AdaptiveLayout { windowSizeClass ->
        when (windowSizeClass) {
            WindowSizeClass.COMPACT -> CompactLayout()
            WindowSizeClass.MEDIUM -> MediumLayout()
            WindowSizeClass.EXPANDED -> ExpandedLayout()
        }
    }
}
```

### 2. Responsive Components
```kotlin
@Composable
fun ResponsiveAIContainer(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp.dp
    val padding = remember(screenWidth) {
        when {
            screenWidth < 600.dp -> 16.dp
            screenWidth < 840.dp -> 24.dp
            else -> 32.dp
        }
    }
    
    Box(
        modifier = modifier
            .fillMaxSize()
            .padding(padding),
        content = content
    )
}
```

## AI Feature Visualization

### 1. Real-time Processing Visualization
```kotlin
@Composable
fun AIProcessingPreview(
    processingState: ProcessingState,
    modifier: Modifier = Modifier
) {
    var animatedProgress by remember { mutableStateOf(0f) }
    
    LaunchedEffect(processingState) {
        when (processingState) {
            is ProcessingState.Processing -> {
                animate(
                    initialValue = 0f,
                    targetValue = 1f,
                    animationSpec = tween(1000)
                ) { value, _ -> animatedProgress = value }
            }
            else -> animatedProgress = 0f
        }
    }
    
    Box(modifier = modifier) {
        // Visualization content
        when (processingState) {
            is ProcessingState.Processing -> {
                ProcessingOverlay(progress = animatedProgress)
            }
            is ProcessingState.Success -> {
                ResultsVisualization(processingState.results)
            }
            is ProcessingState.Error -> {
                ErrorDisplay(processingState.message)
            }
        }
    }
}
```

### 2. Results Display
```kotlin
@Composable
fun AIResultsDisplay(
    results: List<AIResult>,
    onResultSelected: (AIResult) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(results) { result ->
            ResultCard(
                result = result,
                onClick = { onResultSelected(result) }
            )
        }
    }
}

@Composable
fun ResultCard(
    result: AIResult,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = result.label,
                style = MaterialTheme.typography.titleMedium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            LinearProgressIndicator(
                progress = result.confidence,
                modifier = Modifier.fillMaxWidth()
            )
            
            Text(
                text = "${(result.confidence * 100).roundToInt()}%",
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.align(Alignment.End)
            )
        }
    }
}
```

## Performance Considerations

### 1. Lazy Loading
```kotlin
@Composable
fun LazyLoadingImage(
    model: Any,
    contentDescription: String?,
    modifier: Modifier = Modifier
) {
    var isLoading by remember { mutableStateOf(true) }
    
    Box(modifier = modifier) {
        AsyncImage(
            model = model,
            contentDescription = contentDescription,
            modifier = Modifier.fillMaxSize(),
            onLoading = { isLoading = true },
            onSuccess = { isLoading = false },
            onError = { isLoading = false }
        )
        
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}
```

### 2. Efficient List Rendering
```kotlin
@Composable
fun EfficientResultsList(
    results: List<AIResult>,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier,
        state = rememberLazyListState()
    ) {
        items(
            items = results,
            key = { it.id }
        ) { result ->
            key(result.id) {
                ResultItem(result = result)
            }
        }
    }
}
```

## Animation and Transitions

### 1. Processing Animations
```kotlin
@Composable
fun ProcessingAnimation(
    isProcessing: Boolean,
    modifier: Modifier = Modifier
) {
    val transition = updateTransition(
        targetState = isProcessing,
        label = "processing"
    )
    
    val alpha by transition.animateFloat(
        label = "alpha",
        transitionSpec = { tween(durationMillis = 500) }
    ) { processing ->
        if (processing) 1f else 0f
    }
    
    val scale by transition.animateFloat(
        label = "scale",
        transitionSpec = { spring(stiffness = Spring.StiffnessLow) }
    ) { processing ->
        if (processing) 1.2f else 1f
    }
    
    Box(
        modifier = modifier
            .scale(scale)
            .alpha(alpha)
    ) {
        // Processing animation content
    }
}
```

### 2. Result Transitions
```kotlin
@Composable
fun ResultTransition(
    result: AIResult?,
    modifier: Modifier = Modifier
) {
    AnimatedVisibility(
        visible = result != null,
        enter = fadeIn() + expandVertically(),
        exit = fadeOut() + shrinkVertically()
    ) {
        result?.let {
            ResultContent(result = it)
        }
    }
}
```

## Accessibility

### 1. Content Description
```kotlin
@Composable
fun AccessibleAIContent(
    result: AIResult,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .semantics {
                contentDescription = "AI processing result: ${result.label}"
            }
    ) {
        Text(
            text = result.label,
            style = MaterialTheme.typography.titleMedium,
            modifier = Modifier.semantics {
                heading()
            }
        }
        
        LinearProgressIndicator(
            progress = result.confidence,
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    progressBarRangeInfo = ProgressBarRangeInfo(
                        current = result.confidence,
                        range = 0f..1f
                    )
                }
        )
    }
}
```

### 2. Touch Target Sizes
```kotlin
@Composable
fun AccessibleButton(
    onClick: () -> Unit,
    text: String,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .size(48.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = text
            }
    ) {
        Text(text = text)
    }
}
```

## Conclusion

Creating an effective UI/UX for AI-powered apps requires:
1. Clear visualization of AI processing states
2. Responsive layouts for different screen sizes
3. Efficient handling of real-time updates
4. Smooth animations and transitions
5. Accessibility considerations

Key takeaways:
- Use Material Design 3 for modern, consistent UI
- Implement responsive layouts for different devices
- Optimize performance with lazy loading
- Add meaningful animations for better UX
- Ensure accessibility compliance

Next chapter will cover on-device AI implementation details.
