# iOS Crash Audit

Findings from a review of `app/` and `src/` for UI and logic issues that can crash the app on iOS. Ranked by likelihood.

## Will crash

### 1. `format(item.createdAt, …)` with a nullable date
**Files:** `app/audience/[name]/articles.tsx:140`, `app/audience/[name]/podcasts.tsx:128`

The schemas `src/types/article.ts:8` and `src/types/podcast.ts` declare `createdAt: z.coerce.date().nullable().optional()`. When the backend returns `null` (or omits the field), `format(null, …)` throws `RangeError: Invalid time value` and unmounts the screen. iOS shows the LogBox redbox in dev and a hard crash in release.

**Fix:**
```tsx
{item.createdAt ? format(item.createdAt, "do MMM yyyy") : ""}
```

### 2. `useAnimatedScrollHandler` + `Animated.Image` under New Arch
**Files:** `app/event/[id].tsx`, `(tabs)/home/*`

`newArchEnabled: true` is set and the project pins `react-native-reanimated@4.1.1` + `react-native-worklets@0.5.1`. If the worklets plugin is missing from `babel.config.js` (the file isn't present in the repo root), every screen using `useSharedValue` / `useAnimatedScrollHandler` will crash at mount on iOS with *"Reanimated 2 failed to create a worklet"*. Expo SDK 54 does not auto-inject it.

**Fix:** Ensure `babel.config.js` exists with `react-native-worklets/plugin` listed **last** in the plugins array.

## Likely to crash on certain inputs

### 3. `app.json` `scheme` is an array of two strings
`expo-router` and `expo-linking` expect `scheme` to be a single string. The Google reverse-DNS scheme belongs in `ios.infoPlist.CFBundleURLTypes`, not the top-level `scheme`. On a release iOS build this can fail prebuild or produce broken deep links / OAuth callback crashes from `expo-auth-session`.

**Fix:** Set `scheme: "expressionsindia"` and add the Google scheme via `CFBundleURLTypes` in `ios.infoPlist`.

### 4. `<Image source={{ uri: item.thumbnailUrl }} />` where `thumbnailUrl` is nullable
**Files:**
- `src/components/resources/ArticleCard.tsx:41`
- `src/components/resources/PodcastCard.tsx:54`
- `src/components/course/CourseCard.tsx:44`
- `app/audience/[name]/articles.tsx:107`
- `app/audience/[name]/events.tsx:109`
- `app/(tabs)/events/allPastEvents.tsx:94`
- `src/components/CompletedEvents.tsx:95`
- `src/components/UpcomingEvent.tsx:95`
- `app/(tabs)/home/index.tsx:249`

`uri: undefined` is tolerated by iOS, but `uri: null` (which is what `z.string().nullable()` produces) emits a redbox in dev and is undefined behaviour in release.

**Fix:**
```tsx
{item.thumbnailUrl ? <Image source={{ uri: item.thumbnailUrl }} /> : <Placeholder />}
```

## Bugs that won't crash but degrade behaviour

- **`app/article/[id].tsx:48`** — dependency `article?.medias[0]?.url` is missing optional chaining on `medias` (should be `?.medias?.[0]?.url`). With `medias` defaulting to `[]` via Zod this is currently safe, but the pattern is fragile.
- **`src/api/fetchLatestFeed.ts` (and siblings)** call `response.json()` with no `response.ok` check. On HTML 5xx pages this throws `SyntaxError` — caught by React Query, so not fatal, but masks real errors.
- **`app/(tabs)/course/index.tsx:461`** uses `toLocaleDateString("en-IN", …)`. Hermes ships full ICU since RN 0.74, so this is fine on SDK 54 — flag only if shipping to older devices.

## Recommended fix order
1. Verify `babel.config.js` registers `react-native-worklets/plugin` (highest impact — blocks app launch).
2. Null-guard the two `format(item.createdAt, …)` call sites.
3. Move the Google OAuth reverse-DNS scheme out of the top-level `scheme` array.
4. Null-guard the nullable-thumbnail `<Image>` usages.
