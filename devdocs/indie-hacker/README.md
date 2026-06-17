## Repo tour: `indie-hacker`

This repo is less a single app and more a **personal indie/product-builder knowledge base + app starter/project workspace**. Its main theme is: **learning to build, validate, and launch AI/mobile products as a solo developer/product engineer**.

---

## 1. Top-level mental model

You can think of the repo in 5 buckets:

### 1. Solo app launch process
Files:
- `solo-app-dev-master-checklist.md`
- `solo-app-developer-success-checklist.md`
- `solo_app_dev_master_checklist.html`

These are checklists for building and launching solo apps. The master checklist emphasizes practical app success habits like:
- competitor review analysis
- soft launch before global launch
- Play Store review responses
- frequent updates
- Day 1 / Day 7 / Day 30 retention tracking
- monetization and free trials

The key operating rhythm in the docs is:

> Monday–Thursday → build. Friday → analytics + reviews + planning.

---

## 2. Product/app idea library
Main path:

```text
pro-dev-notes/app-business/
```

Important subfolders:

```text
pro-dev-notes/app-business/app-ideas/
pro-dev-notes/app-business/app-prompts/
pro-dev-notes/app-business/android-utility-apps-dev-guide/
pro-dev-notes/app-business/prompts/
pro-dev-notes/app-business/carbon-app-ideas/
pro-dev-notes/app-business/codentratech/
```

Key file:

```text
pro-dev-notes/apps-summary.md
```

This summarizes **45 app ideas**, mostly AI-powered mobile/productivity apps. Categories include:
- AI productivity/work apps
- document/legal apps
- health and wellness apps
- food/lifestyle apps
- personal organization apps
- mobility/travel apps
- niche/specialty apps
- kids/pets/family apps
- fashion/beauty apps
- home/design apps
- education apps

Common technologies mentioned:
- Flutter
- GPT-4 / Claude
- Whisper API
- Vision AI
- on-device ML

This section is your **idea backlog and prompt/spec library**.

---

## 3. Career/product engineer roadmap
Main path:

```text
product-engineer-roadmap/
```

Important files:

```text
product-engineer-roadmap/product-engineer-roadmap.md
product-engineer-roadmap/PRODUCT_BUILDER_SOFTWARE_SKILLS.md
product-engineer-roadmap/earning-potential-analysis.md
product-engineer-roadmap/articles/
product-engineer-roadmap/docs/
product-engineer-roadmap/product-builder-roles/
```

The core message of this section is that traditional “code translation” work is getting commoditized by AI, and the higher-value direction is becoming an:

> AI-native product architect / product builder.

The roadmap emphasizes:
- AI orchestration
- RAG
- prompt engineering and evaluation
- agentic workflows
- market validation
- user journey mapping
- finished product delivery instead of just writing code

The `PRODUCT_BUILDER_SOFTWARE_SKILLS.md` file lists the main skill areas:
- system design
- mobile development
- backend/API integration
- UI/UX
- testing/QA
- version control
- app store publishing
- analytics/monitoring
- security/privacy
- monetization
- agile project management

This is your **career strategy and skill-development section**.

---

## 4. Buildable Android projects
Main path:

```text
pro-dev-projects/
```

It currently contains:

```text
pro-dev-projects/ai-medcine-tacker/
pro-dev-projects/screentime/
```

### `ai-medcine-tacker`
Despite the typo in the folder name, this is an Android app project for an **AI Medicine Tracker**.

Stack from README/build files:
- Kotlin
- Jetpack Compose
- Hilt
- Supabase
- Gemini API / Google Generative AI
- Firebase Messaging
- CameraX
- Coil
- Coroutines

Key app structure:

```text
app/src/main/java/com/aimedicinetracker/
├── MainActivity.kt
├── MyApplication.kt
├── auth/
├── data/
├── di/
├── home/
├── notifications/
├── scan/
└── ui/theme/
```

Main feature domains:
- authentication
- prescription data models/repository
- prescription scanning
- home dashboard
- reminders/notifications
- dependency injection

This looks like a more complete native Android AI app experiment.

### `screentime`
This is a smaller Android/Compose app for screen-time tracking.

Stack:
- Kotlin
- Jetpack Compose
- Android foreground/background service concepts

Structure:

```text
app/src/main/java/com/farabicoders/screentime/
├── MainActivity.kt
├── receiver/
├── service/
├── ui/theme/
└── util/
```

Main concepts:
- `ScreenTimeService.kt`
- `BootReceiver.kt`
- `ScreenStateReceiver.kt`
- `NotificationHelper.kt`
- `TimeManager.kt`

This is useful for learning Android services, receivers, notifications, and device state tracking.

---

## 5. Flutter starter kits / reusable app bases
Main path:

```text
starter-kit/
```

It contains:

```text
starter-kit/appreancekit-unbounded/
starter-kit/subsidysmart-main/
```

These are Flutter projects based around ApparenceKit-style architecture.

### `appreancekit-unbounded`
A larger reusable Flutter starter with:
- Supabase
- Riverpod
- GoRouter
- Firebase Messaging
- Sentry
- Mixpanel
- localization with `slang`
- secure storage
- image picker/upload patterns
- rating prompts
- notifications
- onboarding/auth/settings/features structure

Important layout:

```text
lib/
├── main.dart
├── router.dart
├── core/
├── features/
└── i18n/
```

Notable domains:
- `core/data/`
- `core/guards/`
- `core/initializer/`
- `core/rating/`
- `core/security/`
- `features/authentication/`
- `features/onboarding/`
- `features/notifications/`
- `features/settings/`
- `features/app_appearance/`

### `subsidysmart-main`
This appears to be a more customized Flutter app built from a similar starter base.

Stack includes:
- Flutter/Dart SDK `^3.11.0`
- Supabase Flutter
- Firebase Auth/Core/Messaging/Remote Config
- Riverpod with codegen
- Freezed/json_serializable
- GoRouter
- Dio
- Sentry
- Mixpanel
- localization
- custom theme system
- responsive shell widgets

Important layout:

```text
lib/
├── main.dart
├── router.dart
├── core/
├── features/
├── modules/
└── i18n/
```

Interesting feature areas:

```text
features/analysis/
features/pipeline/
features/profile/
modules/authentication/
modules/feedbacks/
modules/home/
modules/notifications/
modules/onboarding/
modules/settings/
```

This is probably the best place to study a more production-like Flutter architecture in this repo.

---

## 6. Git/repo state
The Git history is short:

```text
05b6856 Fix submodules and convert to regular folders
79b81f8 clean up
b7d9d2e first commit
```

Current working tree has several uncommitted/deleted/untracked changes, including:
- deleted `.agent/` files
- new `.agents/`
- untracked `starter-kit/`
- modified Gradle cache files
- `.DS_Store` changes

So before serious edits, I’d recommend cleaning or committing the current state.

---

## Suggested learning path through this repo

### Step 1: Understand the mission
Read:

```text
product-engineer-roadmap/product-engineer-roadmap.md
product-engineer-roadmap/PRODUCT_BUILDER_SOFTWARE_SKILLS.md
solo-app-dev-master-checklist.md
```

Goal: understand the repo’s strategy: **build shippable AI/mobile products, not just code snippets**.

### Step 2: Browse the app idea backlog
Read:

```text
pro-dev-notes/apps-summary.md
pro-dev-notes/app-business/app-prompts/
pro-dev-notes/app-business/app-ideas/
```

Goal: pick one app idea to turn into a concrete MVP.

### Step 3: Study existing Android examples
Start with:

```text
pro-dev-projects/ai-medcine-tacker/
pro-dev-projects/screentime/
```

Use `ai-medcine-tacker` for AI + Supabase + Gemini + Compose patterns.
Use `screentime` for Android services/receivers/notifications.

### Step 4: Study Flutter starter architecture
Start with:

```text
starter-kit/subsidysmart-main/lib/
starter-kit/appreancekit-unbounded/lib/
```

Focus especially on:
- routing: `router.dart`
- app startup: `main.dart`, `core/initializer/`
- auth guards: `core/guards/`
- state management: Riverpod providers
- data access: repositories and APIs
- feature/module folder organization

### Step 5: Pick one product and turn it into a plan
A good workflow for this repo would be:

1. Pick an app idea from `apps-summary.md`
2. Write a simple PRD
3. Choose Flutter starter or native Android base
4. Build MVP
5. Add analytics/review prompts
6. Soft launch
7. Iterate using the master checklist

---

## My recommendation

If your goal is to become productive with this repo quickly, start here:

1. `product-engineer-roadmap/product-engineer-roadmap.md`
2. `pro-dev-notes/apps-summary.md`
3. `solo-app-dev-master-checklist.md`
4. `starter-kit/subsidysmart-main/lib/router.dart`
5. `starter-kit/subsidysmart-main/lib/core/`
6. `pro-dev-projects/ai-medcine-tacker/app/src/main/java/com/aimedicinetracker/`

That path gives you: **strategy → ideas → launch process → Flutter architecture → Android AI implementation**.