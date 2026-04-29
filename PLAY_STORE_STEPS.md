# Google Play Store — Release Steps

Specific to the Expressions India Android app. Follow in order.

---

## Phase 1 — One-time setup (do before first build)

### 1.1 Google Play Developer account
- Pay the one-time **$25 USD** registration at play.google.com/console
- Use the org Google account, not a personal one

### 1.2 Privacy policy
- Must be a publicly accessible URL
- Hosted on GitHub Pages (see `privacy-policy` repo in the org)
- URL format: `https://<org>.github.io/privacy-policy`

### 1.3 Google Cloud Console — publish OAuth consent screen
- Go to APIs & Services → OAuth consent screen
- Click **Publish App**
- No verification needed for basic email/profile scopes — it's instant
- Anyone with a Google account can now sign in (not just test users)

---

## Phase 2 — Build

### 2.1 Make sure eas.json production env is correct
```json
"EXPO_PUBLIC_API_URL": "https://13.206.10.230.nip.io/api"
"EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "1065952993884-5qgmgao7lmvt4ee37p04hdsdu46n0le6.apps.googleusercontent.com"
```

### 2.2 Run the production build
```bash
eas build --platform android --profile production
```
- Builds in the cloud (~10 min)
- Downloads an `.aab` file when done

---

## Phase 3 — Play Console setup (first time only)

### 3.1 Create the app
- Play Console → Create app
- App name: **Expressions India**
- Default language: English
- App or game: **App**
- Free or paid: **Free**

### 3.2 Store listing
| Field | Value |
|---|---|
| Short description | ≤ 80 chars — e.g. "Courses, events, podcasts and journals for personal growth" |
| Full description | ≤ 4000 chars — describe the app's features |
| App icon | 512×512 PNG (export from the icon in assets/) |
| Feature graphic | 1024×500 PNG/JPG |
| Phone screenshots | 2–8 screenshots (take them from a physical device or emulator) |
| Category | Education |
| Contact email | org contact email |

### 3.3 Content rating
- Play Console → Policy → App content → Content rating
- Fill out the IARC questionnaire (~5 min)
- The app has no violence, no adult content — will get a low rating

### 3.4 Data Safety form
- Play Console → Policy → App content → Data safety
- Declare the following:

| Data type | Collected | Purpose | Shared | Optional |
|---|---|---|---|---|
| Name | Yes | App functionality | No | No |
| Email address | Yes | App functionality | No | No |

- Encrypted in transit: **Yes**
- Users can request deletion: **Yes** (via contact email)

### 3.5 Privacy policy
- Play Console → Policy → App content → Privacy policy
- Paste: `https://<org>.github.io/privacy-policy`

---

## Phase 4 — Upload and test

### 4.1 Upload the AAB
```bash
eas submit --platform android --latest
```
Or drag-drop the `.aab` into Play Console → Testing → Internal testing → Create new release

### 4.2 CRITICAL — Fix Google Sign-In for Play Store installs
After the first upload, Play App Signing gives your app a new signing key.
Google Sign-In validates the calling app's SHA-1, so it will silently fail for
Play Store installs until you register the new SHA-1.

1. Play Console → Setup → App signing
2. Copy the **App signing key certificate SHA-1**
3. Google Cloud Console → APIs & Services → Credentials → your Android OAuth 2.0 client
4. Add the SHA-1 there and save

### 4.3 Internal testing track
- Add your own Google account as a tester
- Install the app from the Play Store link (not sideloaded)
- Test Google Sign-In — this is the only way to catch signing issues

### 4.4 Closed testing (mandatory if account created after Nov 2023)
- Play Console → Testing → Closed testing → Create track
- Add at least **12 real testers** with real Android devices
- They must run the app for **14 days**
- Only after this can you promote to production

---

## Phase 5 — Promote to production

- Play Console → Testing → Closed testing → your release → Promote to Production
- Set rollout percentage (start at 20–50% to catch issues early)
- Submit for review — usually a few hours, occasionally 1–2 days

---

## Ongoing releases

### JS-only changes (no new native modules)
```bash
eas update --branch production --message "describe the change"
```
Ships as an OTA update — no Play Store review, users get it within minutes.

### Native changes (new packages, app.json plugin changes)
```bash
# Bump version in app.json first (e.g. "1.0.1")
eas build --platform android --profile production
eas submit --platform android --latest
```
Then promote the new release in Play Console.

---

## Quick reference

```bash
# Dev build (for testing on device with native modules)
eas build --platform android --profile development

# Preview build (internal distribution, no Play Store)
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production

# OTA update
eas update --branch production --message "fix: describe change"

# Submit latest build to Play Console
eas submit --platform android --latest
```
