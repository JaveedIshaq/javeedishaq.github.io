# AI Household Asset & Warranty Tracker PRD
### Product Requirements Document

> **Purpose:** This product must serve two jobs at the same time:
>
> 1. launch as a real consumer product
> 2. become the starting super-base for future mobile products

This is not just an app spec.
It is also a **product-system spec** for your indie-hacker career.

---

## 1. Product Summary

### Working Name

- `HomeVault`
- `Warranty Wallet`
- `AssetCare`
- `Household Asset & Warranty Tracker`

### Core Promise

- Scan appliances and receipts once, then stop forgetting warranties, manuals, and maintenance tasks.

### Product Type

- mobile-first consumer utility
- local-first with optional account/sync path
- AI-assisted setup and organization

---

## 2. Why This Product Exists

People buy appliances, electronics, and household devices, then lose:

- receipts
- warranty dates
- manuals
- service information
- maintenance schedules

The result:

- missed warranty claims
- wasted money
- poor maintenance
- stress when something breaks

This app should solve a practical household problem, not perform AI for show.

---

## 3. Strategic Role in Your Career

This product is strategically important because it aligns with your actual direction:

- solo product engineer
- indie hacker
- practical AI integration
- reusable product infrastructure

This app must not be treated as a one-off build.
It must become the **base pattern** for future apps.

That means while building it, you should extract reusable modules for:

- onboarding
- auth/guest mode
- notifications
- analytics
- error handling
- feedback
- storage
- file/image attachment
- theming
- settings/privacy/about flows

---

## 4. Product Goals

### Primary Product Goals

- let users store household assets in one place
- make warranty and maintenance tracking easy
- reduce manual setup through AI-assisted extraction
- create a trustworthy utility users keep installed

### Primary Platform Goals

- create a reusable super-base for future apps
- prove a repeatable Flutter + Supabase + AI product architecture
- reduce future MVP build time

### Revenue Goals

- create a product suitable for launch on Play Store
- support a free-to-paid conversion path
- create a base that can later be sold as a marketplace template or starter kit

---

## 5. Non-Goals

These are explicitly out of scope for version 1:

- complex family sharing
- marketplace for repair services
- full e-commerce or parts ordering
- enterprise inventory management
- heavy web admin dashboard
- overly advanced AI chat assistant
- magical manual lookup for every product in the world

This must remain a focused utility app, not a fake platform.

---

## 6. Target Users

### Primary Users

- homeowners
- renters
- families managing multiple appliances
- people who keep receipts and warranty cards badly

### Secondary Users

- landlords
- small property managers
- organized consumers who maintain devices properly

### User Profile

These users are not buying "AI."
They are buying:

- organization
- reminders
- fewer lost details
- less household friction

---

## 7. Product Positioning

### Weak Positioning

- AI home asset app

### Better Positioning

- household warranty and maintenance tracker

### Strong Positioning

- never lose warranty dates, receipts, or appliance reminders again

### Public Positioning Rule

Lead with the practical consumer benefit.
Let AI be a helper, not the headline.

---

## 8. Core User Stories

1. As a user, I want to add an appliance quickly so I can stop storing purchase details in random places.
2. As a user, I want to attach receipt and product photos so I have proof when needed.
3. As a user, I want the app to extract basic product info from a receipt or label so setup takes less effort.
4. As a user, I want to know warranty expiry dates so I do not miss claim opportunities.
5. As a user, I want maintenance reminders so I can take care of appliances before problems happen.
6. As a user, I want to search and filter assets fast when I need them.
7. As a user, I want the app to feel trustworthy and private because it contains household information.

---

## 9. Product Scope

## Version 1 Scope

### Must Have

- onboarding
- guest mode or lightweight auth mode
- asset list
- asset detail page
- add/edit/delete asset
- receipt/photo attachment
- warranty expiry date tracking
- maintenance reminder scheduling
- search and simple filters
- settings/privacy/about
- local notifications
- feedback flow
- analytics and crash monitoring
- strong empty/loading/error states

### AI-Assisted Must Have

- receipt OCR or text extraction
- product name suggestion
- purchase date suggestion
- warranty field prefill suggestion where possible

### Nice to Have

- room/category assignment
- notes field
- manual URL or document attachment
- maintenance interval presets

### Not in V1

- shared family workspace
- cloud sync required for all users
- replacement part marketplace
- vendor integrations
- advanced recommendation engine

---

## 10. Product Architecture Direction

### Recommended Base

Use:

- `starter-kit/appreancekit-unbounded` as the primary product base

Borrow from:

- `starter-kit/subsidysmart-main` for stronger infrastructure patterns:
  - feedback flows
  - remote config ideas
  - Supabase schema structure
  - testing discipline
  - landing/web support if needed later

### Stack

- `Flutter` mobile app
- `Supabase` for optional sync, storage, and future account features
- `AI API` for extraction and smart setup help
- local-first data behavior for the first useful version

### Product System Rule

The app must be designed so reusable modules can later be extracted into your own starter kit without major rewrite.

---

## 11. Super-Base Requirements

These are required because this product must also act as your future product foundation.

### Foundation Modules

- auth or anonymous mode
- onboarding
- settings
- about/support/privacy
- theming
- localization-ready strings

### Product Infrastructure Modules

- secure storage
- analytics
- error handling
- logging
- notifications
- feature feedback
- file/image attachment support
- environment config

### Quality Infrastructure

- testable architecture
- empty/loading/error states
- event tracking for key actions
- crash reporting
- release-friendly config separation

---

## 12. ApparenceKit-Inspired Feature Requirements

These are the features that should be explicitly required because they support your future reusable base.

### Required from Day 1

- Supabase-ready architecture
- auth foundation
- anonymous usage mode
- onboarding module
- push/local notification setup
- analytics integration
- Sentry or equivalent error tracking
- Riverpod architecture
- i18n-ready string structure
- web-compatible structure where reasonable
- responsive widgets/layout helpers

### Strongly Recommended

- feedback module
- cloud storage abstraction
- test scaffolding
- CI/CD-friendly project structure

### Optional Later

- subscription/paywall support
- remote config
- landing website
- social auth

### Important Constraint

Do not let "starter-kit completeness" delay launch.
The product must still ship as a product, not as infrastructure theater.

---

## 13. Functional Requirements

### 13.1 Onboarding

The onboarding must:

- explain the product benefit clearly
- show users what they can store
- show value of reminders and warranty tracking
- lead into quick first asset creation

Required screens:

- welcome
- problem/value explanation
- optional notifications permission prompt context
- quick-start CTA

### 13.2 Asset Management

Users must be able to:

- create a new asset
- edit asset details
- delete asset
- mark asset inactive/disposed

Asset fields:

- asset name
- category
- brand
- model
- serial number
- purchase date
- warranty expiry date
- maintenance frequency
- location or room
- notes
- photos
- receipt/document attachment
- manual link or manual file optional

### 13.3 AI Extraction

The AI-assisted setup should:

- extract text from receipt/photo
- suggest product name
- suggest purchase date
- suggest warranty data if detectable

Rules:

- AI output must always be editable
- AI confidence should not be presented as certainty
- user must confirm before saving

### 13.4 Notifications

The system must support:

- warranty expiry reminders
- scheduled maintenance reminders
- reminder settings per asset
- global notification preferences

### 13.5 Search and Filtering

Users must be able to:

- search by asset name or brand
- filter by category
- filter by room
- filter by expiring soon
- filter by maintenance due

### 13.6 Feedback

The app should include:

- send feedback entry point
- bug report path
- feature request path

This matters both for product improvement and for reusable starter-kit value.

### 13.7 Settings

Settings must include:

- notification preferences
- privacy information
- support/contact
- feedback
- app version
- restore purchases placeholder if monetization is added later

---

## 14. Non-Functional Requirements

### Reliability

- app should work offline for core use cases
- reminders must be dependable
- image handling must not feel fragile

### Performance

- asset list must load quickly
- add/edit flows must feel lightweight
- OCR/extraction should fail gracefully

### Privacy

- user data handling must be clearly explained
- local-first behavior should be emphasized where possible
- cloud sync, if added, must be explicit and understandable

### Maintainability

- modular code structure
- reusable components
- feature boundaries that support starter-kit extraction later

---

## 15. Data Model Direction

Core entities:

- `User`
- `Asset`
- `AssetDocument`
- `Reminder`
- `Feedback`
- `AppSettings`

Suggested `Asset` fields:

- id
- userId or local owner key
- name
- category
- brand
- model
- serialNumber
- room
- purchaseDate
- warrantyExpiryDate
- maintenanceInterval
- nextMaintenanceDate
- notes
- receiptImagePath
- productImagePath
- manualUrl
- createdAt
- updatedAt

---

## 16. Screens

### Product Screens

- Splash / startup
- Onboarding
- Home / asset list
- Add asset
- Edit asset
- Asset detail
- OCR/extraction review
- Search/filter
- Reminder settings
- Settings
- Feedback
- About/privacy/support

### Starter-Kit Value Screens

- reusable onboarding shell
- reusable settings shell
- reusable feedback page
- reusable error and empty states

---

## 17. Analytics Events

Track events like:

- onboarding_started
- onboarding_completed
- asset_created
- asset_edited
- asset_deleted
- receipt_scanned
- ai_extraction_used
- reminder_created
- reminder_completed
- feedback_sent
- paywall_viewed

Keep analytics practical.
Track product decisions, not vanity noise.

---

## 18. Error Handling Requirements

This is mandatory.

The app must have:

- safe API/network wrappers
- clear user-facing error messages
- retry states
- image upload/import failure handling
- AI extraction failure handling
- notification permission handling
- global unexpected error logging

This is one of the most important reusable parts of the super-base.

---

## 19. Monetization Requirements

### Version 1 Monetization Direction

- free tier with asset limit
- future one-time Pro unlock or subscription support

### Pro Possibilities

- unlimited assets
- advanced reminder rules
- export/backup
- document/manual storage upgrades
- future family sharing

### Rule

Do not let monetization complexity block launch.
Infrastructure hooks are enough for V1 if needed.

---

## 20. Testing Requirements

At minimum:

- model tests
- repository/service tests
- notification logic tests
- form validation tests
- smoke test for app startup

Preferred:

- golden tests for key screens
- onboarding flow test
- add asset flow test

---

## 21. Release Requirements

Before release:

- privacy policy ready
- screenshots ready
- clear Play Store copy
- onboarding polished
- reminder flow verified
- crash monitoring configured
- feedback path working

This product must be release-minded from the start.

---

## 22. Future Extraction Strategy

This product should later give birth to:

- your internal mobile starter kit
- your own marketplace-ready starter if it proves reusable enough

Modules most worth extracting:

- onboarding system
- asset-style CRUD shell
- image/document attachment flow
- reminder engine
- feedback flow
- settings/about/privacy system
- analytics/error plumbing

---

## 23. Development Principle

This project must be built with this rule:

**product first, starter kit second**

That means:

- do not over-engineer the base before proving the product
- extract only what becomes reusable naturally
- keep the app real enough to launch

If you forget this, you will build infrastructure and call it progress.

---

## 24. Final Decision

This product is approved as:

- a practical next app
- a strong reusable base candidate
- a better fit for your career plan than a more glamorous AI idea

It is strategically good because it:

- solves a believable problem
- fits your stack
- can ship as a solo product
- supports a future starter-kit business
- teaches practical AI integration without needing enterprise complexity

That makes it a high-value build.
