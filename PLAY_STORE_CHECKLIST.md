# Play Store Release Checklist — Expressions India

Audit date: 2026-04-28. Target: Google Play Store only (no iOS/App Store).

The app is **functionally close to releasable** but has a handful of code-side cleanups, plus all the off-code work the Play Console requires (listing assets, data-safety form, signing, testing tracks). Items are roughly ordered by blocking severity.

---

## 1. Blocking — fix before first internal build

### 1.1 Production API endpoint uses an IP-based hostname
- `eas.json` production env: `EXPO_PUBLIC_API_URL=https://13.206.10.230.nip.io/api`
- `nip.io` is a wildcard DNS service that maps a hostname to a literal IP. It works (and provides HTTPS via Let's Encrypt), but it is brittle: if the EC2 instance moves to a new IP, every installed copy of the app breaks until you ship a new build.
- **Action:** buy a domain (~$10/yr at Cloudflare Registrar), point an `A` record at an Elastic IP, get TLS via Certbot or Cloudflare. Then set `EXPO_PUBLIC_API_URL=https://api.<your-domain>/api` in `eas.json`.
- Even if you ship the IP-based URL initially, do this before you have many installs — the cost of a backend migration grows linearly with active users.

### 1.2 Cleartext traffic is enabled but the API is HTTPS
- `app.json` has `android.usesCleartextTraffic: true`.
- The actual API URL is HTTPS, so this flag is **unnecessary** and is the kind of thing a Play reviewer or static analyzer flags as a security weakness.
- **Action:** remove `usesCleartextTraffic` (or set it to `false`). Confirm nothing in the app talks to plain `http://`.

### 1.3 Stray `console.log` in production code
- `src/components/resources/PodcastCard.tsx:26` — `console.log(thumb)` debug leftover.
- The other 5 `console.error` calls are legitimate.
- **Action:** delete the `console.log(thumb)` line.

### 1.4 Local `.env` still points to a localtunnel
- `.env` has `EXPO_PUBLIC_API_URL=https://deep-doodles-visit.loca.lt/api`.
- This file is git-ignored so it won't ship in the build, and EAS production builds use `eas.json` env, **not** the local `.env`. So this is fine — but verify by running `eas build --platform android --profile production --non-interactive --dry-run` (or just inspect the build logs the first time) to confirm the production URL is what's baked in.

### 1.5 App version
- Currently `version: "1.0.0"` in `app.json`. `appVersionSource: "remote"` in `eas.json` means EAS manages `versionCode` automatically (auto-increments), so no `android.versionCode` is needed locally.
- **Action:** keep `1.0.0` for first release. After release you bump `version` (the user-facing semver) before each new submission; EAS handles the integer `versionCode`.

### 1.6 Splash screen background
- Current splash uses `backgroundColor: "#ffffff"` while the app theme is red. The icon you just imported has a red background, so the icon visually "floats" on white during launch.
- Not blocking, but cosmetically jarring.
- **Action (optional but recommended):** change `expo-splash-screen` plugin `backgroundColor` to match the icon's red (e.g., `#e10000`) so the splash feels integrated.

---

## 2. Off-code work (Play Console)

These can't be fixed in code. Allocate ~half a day for first-time setup plus the test-track wait.

### 2.1 Google Play Developer account
- One-time **$25 USD** registration. If you don't already have it, this is the first thing to do because the closed-test track requirement (below) starts the moment you create the app.

### 2.2 Privacy Policy URL — REQUIRED
- Play Console will not let you publish without a hosted privacy policy URL.
- The app collects:
  - Account info via Google OAuth (email, name)
  - Auth tokens stored in `expo-secure-store`
  - Network requests to your API
- **Action:** write a privacy policy and host it (a static HTML page on your domain works, or a free Notion page made public). Paste the URL in Play Console → App content → Privacy policy.

### 2.3 Data Safety form — REQUIRED
- Play Console → App content → Data safety. You must declare every category of data collected, whether it's encrypted in transit, whether it's shared with third parties, etc.
- For this app, declare at minimum:
  - **Personal info:** Name, Email — collected via Google sign-in, used for app functionality, not shared, encrypted in transit (yes, since API is HTTPS), users can request deletion.
  - **App activity:** if you log analytics events anywhere — currently you don't appear to.

### 2.4 Closed testing requirement (NEW developer accounts)
- If your Play Console account was created **after Nov 13, 2023**, Google requires a **closed test with at least 12 testers running the app for at least 14 days** before you can promote to production. This catches a lot of first-time submitters off guard.
- **Action:** start the closed test as early as possible. Recruit testers (real people on Android devices) before you're ready to launch.

### 2.5 Listing assets you'll need to upload
| Asset | Spec |
|---|---|
| App icon | 512×512 PNG (separate from in-app icon) |
| Feature graphic | 1024×500 PNG/JPG |
| Phone screenshots | 2–8 screenshots, min 320px on shortest side |
| Short description | up to 80 chars |
| Full description | up to 4000 chars |
| App category | Education / Lifestyle (your call) |
| Content rating | filled out via IARC questionnaire in Console |
| Contact email | required, public on the listing |

### 2.6 App signing
- EAS Build manages the upload key on its servers by default — no `.jks` work needed.
- Play App Signing (recommended, default for new apps) means Google holds the *app signing key* and you keep the *upload key*. Don't try to do manual key management your first time.

---

## 3. Recommended (not blocking)

### 3.1 Drop `expo-apple-authentication` for Android-only build
- The plugin is loaded in `app.json` (`"expo-apple-authentication"`) and `ios.usesAppleSignIn: true` is set. Apple Sign-In only works on iOS, so on Android this plugin contributes dead native code.
- **Action:** if you genuinely don't plan an iOS build for the foreseeable future, remove it from `plugins` and drop the dependency to keep the AAB lean. Easy to add back later.

### 3.2 `androidStatusBar.backgroundColor: "#000000"`
- Hard-coded black, but the app uses `theme.red` for the status bar via `<StatusBar>` at runtime. This static value only applies before JS is loaded — i.e., the brief native-splash window. It's a minor visual jolt (black flash) before the JS-controlled red status bar takes over.
- **Action:** change to `"#e10000"` (or whatever matches your splash background) for a smoother boot.

### 3.3 `predictiveBackGestureEnabled: false`
- Disables Android 14+ predictive back animation. UX-wise the modern animation is nicer, but enabling it requires verifying every screen handles back-navigation cleanly. Safe to leave `false` for v1.0.0.

### 3.4 OAuth redirect URI scheme
- Your `app.json` `scheme` array includes `com.googleusercontent.apps.<client-id>`. Confirm in Google Cloud Console that this OAuth client has the matching package name `com.expressionsindia.app` and SHA-1 fingerprint registered. The SHA-1 will change once Google switches to its own app-signing key, so:
- **After your first internal-testing build is uploaded**, go to Play Console → Setup → App signing, copy the **App signing key SHA-1**, and add it to your Google Cloud OAuth Android client. Without this, Sign-in-with-Google will silently fail for users who install from the Play Store (it works fine for sideloaded builds because they use your dev key).

### 3.5 Test on a physical device via internal testing track
- Emulators don't catch a lot of real-world issues (Sign-in with Google flows, deep links, system-bar behavior on edge-to-edge devices, gesture nav).
- **Action:** use Play Console's **Internal testing** track (separate from closed testing) for fast feedback. You add your own Google account as a tester and download from the Play Store directly. Iterate here before promoting to closed testing.

---

## 4. Build and submit commands (for reference)

```bash
# First-time auth
eas login

# Configure credentials (only once)
eas credentials

# Build a production AAB
eas build --platform android --profile production

# Submit the latest build to Play Console (you still publish from the Console UI)
eas submit --platform android --latest
```

After the first `eas submit`, you upload subsequent builds either via `eas submit` or by drag-and-dropping the AAB in Play Console.

---

## 5. Iteration after launch

- **Native or dependency changes** → new EAS build, upload to Play Console, wait for review (usually a few hours, occasionally a couple of days).
- **JS / asset only changes** → `eas update --branch production` ships an OTA update to existing installs in seconds, no review.
- Bump `app.json` `version` (e.g. `1.0.1`) before each new EAS build. `versionCode` auto-increments since `appVersionSource: "remote"` is set.

---

## TL;DR — minimum to ship today

1. Delete `console.log(thumb)` in `PodcastCard.tsx`.
2. Set `usesCleartextTraffic: false` in `app.json`.
3. (Strongly recommended) buy a domain and switch the production API URL.
4. Write and host a privacy policy.
5. Create the Play Console app, fill Data Safety + content rating + listing assets.
6. Run an internal test build (`eas build --profile production`), submit, fix anything that breaks.
7. Run a closed test with ≥12 real testers for 14 days (if your account is post-Nov 2023).
8. Promote to production.
