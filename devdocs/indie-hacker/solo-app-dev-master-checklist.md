# Solo App Developer Master Checklist

Use this as the only checklist. It is written from the perspective of a full-time indie app operator, not a hobbyist. The goal is simple: ship apps that survive review, retain users, and make money on both Android and iOS.

## How to use this

- Finish the critical items before you let yourself polish anything.
- Do not build features without a clear retention or revenue reason.
- Do not launch globally before a soft launch.
- Do not spend on ads until retention proves the product deserves traffic.

---

## 1. Market, Offer, and Positioning

### Critical
- [ ] Define the app in one sentence: who it helps, what painful outcome it solves, and why your angle is better.
- [ ] Pick one primary user segment. If the app is "for everyone," it is for nobody.
- [ ] Audit the top 10 competitors across App Store and Play Store.
- [ ] Read competitor 1-star, 3-star, and 5-star reviews to find repeated complaints, feature gaps, and emotional triggers.
- [ ] Decide the monetization model before architecture starts: paid, freemium, subscription, ads, lead-gen, or commerce.
- [ ] Cut the MVP until it has one obvious core action and one obvious habit loop.

### Important
- [ ] Validate demand with search trends, Reddit, TikTok, YouTube comments, and niche communities.
- [ ] Check keyword difficulty and search intent for your main category terms.
- [ ] Write a positioning statement that is specific enough to use on the store listing and landing page.
- [ ] Define the "moment of value" the user should hit in the first session.

---

## 2. Product Scope and UX

### Critical
- [ ] Design onboarding so the user understands the value within 30 seconds.
- [ ] Ask for permissions only after the user understands why they matter.
- [ ] Make the first session fast: no dead-end setup, no bloated forms, no empty dashboard.
- [ ] Give every screen one primary action.
- [ ] Design empty states, loading states, offline states, and error states before launch.
- [ ] Make the app usable one-handed on common phone sizes.

### Important
- [ ] Wireframe the full core flow before serious implementation.
- [ ] Support dynamic text, readable contrast, and minimum tap targets.
- [ ] Test the app icon next to competitors at small sizes. If it disappears, it fails.
- [ ] Decide where delight actually helps retention and where it is just decoration.

---

## 3. Build Quality and Architecture

### Critical
- [ ] Use an architecture you can maintain alone for 2 years.
- [ ] Set up crash reporting from day 1.
- [ ] Set up product analytics from day 1.
- [ ] Keep secrets out of the codebase and out of the client app when possible.
- [ ] Handle no-network, slow-network, and server-failure cases gracefully.
- [ ] Keep cold start fast on a mid-range Android device and an older iPhone.
- [ ] Test core flows on low-memory and low-storage conditions.
- [ ] Implement lifecycle handling correctly: background, restore, interrupted purchase, interrupted auth.

### Important
- [ ] Add deep linking and universal linking from the start if sharing or lifecycle campaigns matter.
- [ ] Build remote config or feature flag support so you can react without a full release.
- [ ] Keep build size under control by auditing dependencies early.
- [ ] Set up CI/CD for release builds, tests, and signing checks.

---

## 4. Analytics, Feedback, and Retention Instrumentation

### Critical
- [ ] Track onboarding completion.
- [ ] Track account creation or first-session activation.
- [ ] Track the first core success event.
- [ ] Track Day 1, Day 7, and Day 30 retention.
- [ ] Track trial start, paywall view, purchase success, and cancellation.
- [ ] Add an in-app feedback path before users dump their frustration into public reviews.
- [ ] Trigger review prompts after a win moment, never randomly.

### Important
- [ ] Track uninstall signals where the platform allows it.
- [ ] Create dashboards for crashes, retention, conversion, and revenue in one place.
- [ ] Add funnel breakdown by country, platform, and acquisition source.

---

## 5. Monetization Discipline

### Critical
- [ ] Make the free tier useful enough to create trust.
- [ ] Put the paywall where user intent is highest, not where your anxiety is highest.
- [ ] Test all purchase, restore, refund, and cancellation flows on both platforms.
- [ ] Validate subscription copy, pricing tiers, and trial logic before launch.
- [ ] Track revenue, conversion rate, refund rate, and ARPU from day 1.

### Important
- [ ] Offer annual pricing if the product has repeat value.
- [ ] Test a free trial if subscriptions are central to the business.
- [ ] Handle churn with downgrade, pause, or save offers if the product economics support it.
- [ ] Make billing screens trustworthy, plain, and compliant instead of clever.

---

## 6. Store Compliance: Android and iOS

### Critical
- [ ] Register and verify both developer accounts properly.
- [ ] Publish a real privacy policy that matches actual behavior.
- [ ] Document every SDK, data type collected, and third-party sharing path.
- [ ] Complete Google Play Data Safety accurately.
- [ ] Complete App Store privacy nutrition labels accurately.
- [ ] Use permission copy that matches actual app behavior.
- [ ] Remove test accounts, debug menus, fake data, and placeholder text from release builds.
- [ ] Back up signing credentials and recovery instructions in more than one safe place.

### Important
- [ ] Review current Play Store and App Store policy requirements before each major submission.
- [ ] Prepare a reviewer note for App Review if the app has login, hardware dependencies, or non-obvious flows.
- [ ] Verify age rating and content declarations carefully.

---

## 7. Pre-Launch QA

### Critical
- [ ] Test the complete funnel: install, onboarding, core action, conversion event, support path, delete account path.
- [ ] Test on multiple Android versions and multiple iPhone screen sizes.
- [ ] Test denied permissions, interrupted payments, expired sessions, and backend timeouts.
- [ ] Run internal testing and a limited beta before public launch.
- [ ] Verify push notifications, deep links, subscription restore, and auth recovery.
- [ ] Confirm support email, legal links, and backend endpoints are live and stable.

### Important
- [ ] Run a release checklist on a clean device, not only on your dev phone.
- [ ] Ask external testers to record confusion points instead of just reporting bugs.
- [ ] Use a soft-launch market or limited-country rollout before global exposure.

---

## 8. Store Listing and Conversion

### Critical
- [ ] Write a title and subtitle/short description that state the outcome, not just the category.
- [ ] Make screenshots sell the benefit in sequence, not just show screens.
- [ ] Ensure the first two screenshots explain the promise without requiring the user to think.
- [ ] Use visuals that match the real app. Overpromising destroys ratings.
- [ ] Write store copy around problems solved, proof, and trust.

### Important
- [ ] Localize the listing for the most likely revenue countries.
- [ ] Test screenshot variants over time.
- [ ] Add preview video only if it is polished and outcome-focused.
- [ ] Build a landing page to capture traffic you cannot convert immediately.

---

## 9. Launch Strategy

### Critical
- [ ] Launch in stages. Do not dump a fragile build into the whole market.
- [ ] Monitor crashes, ANRs, review sentiment, conversion, and purchase failures during the first 72 hours.
- [ ] Keep a hotfix path ready before launch day.
- [ ] Prepare response templates for common support and review issues.
- [ ] Announce the app where your actual users already spend time, not where founders perform for each other.

### Important
- [ ] Line up launch posts, founder story, and demo clips before release day.
- [ ] Reach out to niche creators or community owners who serve your exact audience.
- [ ] Schedule the first post-launch improvement release before the launch even happens.

---

## 10. Post-Launch Growth

### Critical
- [ ] Respond to every early review, especially negative ones.
- [ ] Review analytics and support feedback weekly.
- [ ] Ship meaningful improvements every 2-4 weeks while the app is still earning trust.
- [ ] Kill weak features that add complexity without retention or revenue impact.
- [ ] Fix onboarding before buying traffic if retention is weak.

### Important
- [ ] Interview real users and compare what they do with what you assumed they would do.
- [ ] Build referral loops only after the base experience works.
- [ ] Localize product and support for the markets already showing traction.
- [ ] Turn testimonials, wins, and use cases into listing and landing page proof.

---

## 11. Solo Founder Operations

### Critical
- [ ] Separate business and personal finances.
- [ ] Track monthly revenue, expenses, margin, refunds, and platform fees.
- [ ] Time-block the week: product, support, analytics, growth, admin.
- [ ] Protect build time from low-value busywork.
- [ ] Keep a release runbook so every update does not rely on memory.

### Important
- [ ] Automate repeatable tasks like builds, reports, and alerts.
- [ ] Keep a roadmap with ruthless prioritization: retention first, revenue second, vanity third.
- [ ] Maintain a support SLA that users can feel.
- [ ] Avoid burnout cycles that destroy shipping consistency.

---

## 12. Brutal Filters

If the answer is "no" to any of these, stop pretending the app is ready.

- [ ] Can a stranger understand the value in under 10 seconds?
- [ ] Can a first-time user reach the core win without help?
- [ ] Does the app survive bad network conditions without feeling broken?
- [ ] Do you know the Day 1 retention number?
- [ ] Do you know what event predicts conversion?
- [ ] Would you spend your own money to acquire a user into this funnel?
- [ ] Is there a clear reason this app deserves to exist instead of the current top 3?

---

## Weekly rhythm that actually works

- Monday to Thursday: build and fix what moves retention or revenue.
- Friday: reviews, analytics, experiments, roadmap cuts.
- Daily: support, crash checks, and one hard decision you have been avoiding.

## Final rule

Most solo apps fail for boring reasons: weak positioning, bad onboarding, poor retention, soft execution, and no distribution discipline. Not because the founder lacked one more feature idea.
