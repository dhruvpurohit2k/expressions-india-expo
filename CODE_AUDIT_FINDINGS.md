# Code Audit Findings - Expressions India Expo App

**Date:** 2026-04-08  
**Scope:** Complete codebase audit (API layer, components, screens, utilities, hooks)  
**Status:** 40+ issues identified across 4 severity levels

---

## 🔴 CRITICAL ISSUES (Crashes, Broken Functionality)

### 1. Invalid HSL Color Value - Will Show Invisible Text
- **File:** `app/(tabs)/resources/index.tsx:187`
- **Code:** `color: "hsl(0, 120%, 50%)"`
- **Issue:** Saturation of 120% is out of valid 0-100% range. Renders as invisible/black on some platforms.
- **Fix:** Use `"hsl(0, 100%, 50%)"` or `theme.red`

### 2. Director Component - Comma Operator Bug Silently Discards Style
- **File:** `src/components/Director.tsx:10-12`
- **Code:**
  ```typescript
  style={(
    globalStyle.screen,
    { paddingHorizontal: 20, backgroundColor: theme.backgroundColorLight }
  )}
  ```
- **Issue:** Comma operator returns only the second expression. `globalStyle.screen` (with `flex: 1`) is discarded, breaking layout.
- **Fix:** Use array syntax: `style={[globalStyle.screen, { paddingHorizontal: 20, ... }]}`

### 3. Events.tsx Imports Non-Existent Components
- **File:** `src/components/Events.tsx:23-24`
- **Code:**
  ```typescript
  import UpcomingEvents from "./UpcomingEvents";
  import PastEvents from "./PastEvents";
  ```
- **Issue:** Actual filenames are `UpcomingEvent.tsx` and `CompletedEvents.tsx`. File will not compile if imported.
- **Fix:** Correct the import paths

### 4. WorkShops.tsx Navigates to Non-Existent Route
- **File:** `src/components/WorkShops.tsx:87`
- **Code:** `router.push(`/workshop/${workshop.id}`)`
- **Issue:** No `/app/workshop/` route exists. Crashes at runtime with "not found" error.
- **Fix:** Either create the route or remove this navigation

### 5. Unsafe JSON.parse Without Error Handling
- **Files:** 
  - `app/event/gallery.tsx:29`
  - `app/event/videos.tsx:19`
- **Code:** `const images: string[] = urls ? JSON.parse(urls) : [];`
- **Issue:** Malformed JSON crashes the screen. No try/catch wrapper.
- **Fix:** 
  ```typescript
  let images: string[] = [];
  try {
    images = urls ? JSON.parse(urls) : [];
  } catch (e) {
    console.error('Failed to parse images:', e);
  }
  ```

### 6. Registration Form Submit Does Nothing
- **File:** `app/registration.tsx:27`
- **Code:**
  ```typescript
  onSubmit: async ({ value }) => {
    console.log("Registration form submitted:", value);
  },
  ```
- **Issue:** Form has no API integration. Button press is unresponsive.
- **Fix:** Implement actual API call to submit form data

### 7. Past Events Screen Uses Stale Local Data
- **File:** `app/event/pastevents.tsx:20`
- **Code:** `import events from "@/data/events/events";`
- **Issue:** Hardcoded local JSON data instead of API. Inconsistent with rest of app. Data will be stale.
- **Fix:** Use `useUpcomingEventQuery()` or similar hook to fetch from API

### 8. Rules of Hooks Violation - useAnimatedScrollHandler Called in JSX
- **Files:**
  - `src/components/AboutUs.tsx:42-44, 77-81`
  - `app/event/pastevents.tsx:58`
- **Code:**
  ```typescript
  onScroll={useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  })}
  ```
- **Issue:** React hooks must be called at component top level, not inside JSX props. This violates Rules of Hooks.
- **Fix:** Call at top level:
  ```typescript
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  // Then use: onScroll={scrollHandler}
  ```

---

## 🟠 HIGH PRIORITY ISSUES (Bad UX, Security, Network)

### 9. No HTTP Status Code Checking in ANY API Call
- **Affected:** All 17 files in `src/api/`
- **Issue:** Every fetch function reads `json.success` but never checks `response.ok` or `response.status`. If server returns 500/404 or network error with non-JSON body, `response.json()` throws unhelpful `SyntaxError: Unexpected token` instead of meaningful error.
- **Example:** `src/api/fetchArticle.ts:8`
  ```typescript
  const json = await response.json(); // ❌ No status check first
  ```
- **Fix:** Add before `.json()`:
  ```typescript
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  ```

### 10. API Uses Plain HTTP with Hardcoded Private IP
- **File:** `.env:1`
- **Code:** `EXPO_PUBLIC_API_URL=http://192.168.1.12:8000/api`
- **Issues:**
  - Plain HTTP (not HTTPS) - all traffic including future auth tokens unencrypted
  - Local network IP `192.168.1.12` - app fails for any user not on that specific LAN
  - This is development-only and should never ship
- **Fix for production:**
  ```env
  EXPO_PUBLIC_API_URL=https://api.expressionsindia.app
  ```

### 11. Carousel Image Functions Skip Zod Validation (Type Safety Bypass)
- **Files:**
  - `src/api/fetchCompletedCarouselImages.ts:11`
  - `src/api/fetchUpcomingCarouselImages.ts:11`
- **Code:** `return (json.data as string[]) ?? [];`
- **Issue:** Only fetch functions using raw `as` cast instead of Zod `safeParse`. Non-string values in array will silently pass and likely crash at render.
- **Fix:** Add Zod schema:
  ```typescript
  const schema = z.array(z.string());
  const parsed = schema.safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
  ```

### 12. Missing Error Boundaries Anywhere in App
- **File:** `app/_layout.tsx`
- **Issue:** Any unhandled JS error crashes entire app with white screen. No recovery mechanism.
- **Fix:** Add Error Boundary component wrapping all content in root layout:
  ```typescript
  // Create src/components/ErrorBoundary.tsx
  export class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
      return this.state.hasError ? <ErrorScreen /> : this.props.children;
    }
  }
  ```

### 13. Aggressive Battery-Draining Refresh Interval
- **File:** `.env:2`
- **Code:** `EXPO_PUBLIC_REFRESH_TIME=5000` (5 seconds)
- **Issue:** 12 hooks refetch every 5 seconds unconditionally, including in background:
  - `useArticleQuery`, `useEvent`, `useJournal`, `useLatestFeed`, etc.
  - Only 2 hooks (`useCompletedCarouselImages`, `useUpcomingCarouselImages`) set `refetchIntervalInBackground: false`
  - Others continue polling even when app is backgrounded, draining battery
- **Fix:** 
  1. Increase to at least 60_000 (1 minute)
  2. Add `refetchIntervalInBackground: false` to all hooks with `refetchInterval`

### 14. No Request Timeout or AbortController
- **Issue:** If server hangs, requests hang indefinitely. User stuck on loading spinner forever.
- **Affected:** All 17 API fetch functions
- **Fix:** Add timeout wrapper:
  ```typescript
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    // ...
  } finally {
    clearTimeout(timeoutId);
  }
  ```

### 15. No Network Error Handling
- **Issue:** If `fetch()` throws (no network, DNS failure), error is generic `TypeError: Network request failed` with no user-friendly message.
- **Affected:** All 17 API fetch functions
- **Fix:** Wrap all `fetch()` calls in try/catch with meaningful error messages

### 16. Missing ID Param Validation on Detail Screens
- **Files:**
  - `app/event/[id].tsx:822`
  - `app/article/[id].tsx`
  - `app/podcast/[id].tsx`
  - `app/journal/[id].tsx`
- **Code:** `const { id } = useLocalSearchParams<{ id: string }>();`
- **Issue:** `id` could be `undefined` if route is hit directly. Hooks called with undefined ID cause crashes.
- **Fix:** Validate before rendering:
  ```typescript
  if (!id) {
    return <View><Text>Item not found</Text></View>;
  }
  ```

### 17. Audience Detail Screen Missing Error State
- **File:** `app/audience/[name]/index.tsx:51`
- **Code:** 
  ```typescript
  const { data: audience, isLoading } = useAudience(name);
  // Never checks error
  ```
- **Issue:** If fetch fails, user sees blank/loading screen indefinitely.
- **Fix:** Destructure and display error:
  ```typescript
  const { data: audience, isLoading, error } = useAudience(name);
  if (error) return <ErrorState message={error.message} />;
  ```

---

## 🟡 MEDIUM PRIORITY ISSUES (Performance, Code Quality)

### 18. styleFactory() Called on Every Render
- **Issue:** `styleFactory()` calls `StyleSheet.create()` on every component render, allocating new objects each time.
- **Affected:** Virtually every screen file and many components
- **Fix:** Create styles at module level (once):
  ```typescript
  const globalStyle = styleFactory(); // Outside component
  export default function MyScreen() {
    // use globalStyle
  }
  ```

### 19. Dimensions.get("window") Called at Module Level - Stale on Rotation
- **Files:**
  - `src/components/AboutUs.tsx:16`
  - `src/components/Events.tsx:27`
  - `app/event/[id].tsx:40-41`
  - `src/styleFactory.ts:83`
- **Issue:** Captured once at import time. Becomes stale on device rotation or resize. Breaks layout on tablets/foldables.
- **Fix:** Use `useWindowDimensions()` hook instead:
  ```typescript
  import { useWindowDimensions } from 'react-native';
  const { width, height } = useWindowDimensions();
  ```

### 20. Carousel Creates Massive 1000+ Element Array
- **File:** `src/components/Carousel.tsx:32`
- **Code:** `const REPEAT_COUNT = 100;` then `Array(REPEAT_COUNT).fill(images).flat()`
- **Issue:** If 10 images, creates 1000-element array. Memory-heavy infinite scroll implementation.
- **Fix:** Use modular index approach instead:
  ```typescript
  const getImageIndex = (index: number) => index % images.length;
  ```

### 21. Inline renderItem Functions in FlatLists Without Memoization
- **Files:**
  - `app/(tabs)/events/allPastEvents.tsx:69`
  - `src/components/UpcomingEvent.tsx:64`
  - `src/components/CompletedEvents.tsx:64`
- **Issue:** New function created on every parent render, causing FlatList to recreate all items.
- **Fix:** Extract and memoize with `useCallback`:
  ```typescript
  const renderItem = useCallback(({ item }) => <ItemComponent item={item} />, []);
  ```

### 22. Inconsistent API Pattern - Only fetchEvent Uses parseApiResponse
- **Issue:** `fetchEvent.ts` uses shared `parseApiResponse()` utility while 16 other fetch functions inline their own error handling. Creates maintenance burden - bug fix in one pattern requires 16 manual updates.
- **Fix:** Consolidate all fetch functions to use `parseApiResponse` (or create new wrapper)

### 23. Duplicate refreshTime Constant Across 12 Hook Files
- **Issue:** Every hook file has:
  ```typescript
  const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;
  ```
- **Fix:** Extract to shared config file `src/lib/config.ts`:
  ```typescript
  export const REFRESH_TIME = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;
  ```

### 24. console.log Statements Left in Production Code
- **Files:**
  - `app/(tabs)/resources/index.tsx:55`
  - `src/components/WorkShops.tsx:28, 162`
  - `app/registration.tsx:27`
- **Fix:** Remove all console.log calls before production

### 25. Missing Dependencies in useEffect Hooks
- **File:** `app/(tabs)/_layout.tsx:19`
  - Uses `focused` and `scale`, dependency list only includes `focused`
- **File:** `src/components/NavBar.tsx:85`
  - Uses `isActive` and `scale`, dependency list only includes `isActive`
- **File:** `src/components/SplashScreen.tsx:119`
  - Empty deps `[]` but references multiple values
- **Fix:** Include all external values in dependency array

### 26. Android NavigationBar APIs Called Without Platform Check
- **File:** `app/_layout.tsx:51-53`
- **Code:**
  ```typescript
  NavigationBar.setBackgroundColorAsync(theme.sectionHeadingColor);
  NavigationBar.setButtonStyleAsync("light");
  ```
- **Issue:** Android-only APIs called unconditionally. Should guard for cleaner code.
- **Fix:**
  ```typescript
  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync(theme.sectionHeadingColor);
    NavigationBar.setButtonStyleAsync("light");
  }
  ```

### 27. EventSchema vs EventListItemSchema ID Type Mismatch
- **File:** `src/types/event.ts`
- **Issue:**
  - `EventListItemSchema:4` uses `id: z.uuid()`
  - `EventSchema:27` uses `id: z.string()`
- **Problem:** Same API endpoint returns same ID but validated against different types. Non-UUID strings pass one but fail the other.
- **Fix:** Use consistent type (likely `z.uuid()` if IDs are UUIDs)

### 28. Type Safety Bypass - Multiple `any` Types
- **Files:**
  - `app/(tabs)/_layout.tsx:13` - `PillTabButton(props: any)`
  - `src/components/Pagination.tsx:13` - `setPage: any`
  - `src/components/NavBar.tsx:23` - `currentTabSetter: any`
- **Fix:** Add proper TypeScript types:
  ```typescript
  // Instead of any, use:
  type PillTabButtonProps = Omit<BottomTabBarButtonProps, 'style'> & { style?: StyleProp<ViewStyle> };
  ```

### 29. Mixed ID Types Across All Schemas
- **Inconsistency:**
  - `article.ts`: `id: z.string()`
  - `event.ts`: `id: z.uuid()` (ListItem) vs `z.string()` (Detail)
  - `journal.ts`: `id: z.uuid()`
  - `podcast.ts`: `id: z.uuid()`
  - `audience.ts`: `ID: z.number()` (uppercase!)
- **Fix:** Standardize on single ID type across all entities

### 30. TABS and Options Arrays Recreated Every Render
- **Files:**
  - `app/(tabs)/events/index.tsx:14-17` - `TABS` array created each render
  - `app/(tabs)/foryou/forStudent.tsx:11-44` - `options` array created each render
- **Fix:** Define outside component or wrap with `useMemo`

---

## 🔵 ACCESSIBILITY ISSUES

### 31. No accessibilityLabel on Any Interactive Element
- **Affected:** Entire codebase
- **Issue:** Screen readers cannot describe buttons, back navigation, tabs, pagination controls, etc.
- **Examples needing fixes:**
  - `app/(tabs)/_layout.tsx` - PillTabButton (no accessible prop)
  - `app/event/[id].tsx` - Back button (ChevronLeft icon)
  - `src/components/Pagination.tsx` - Page buttons
  - `app/(tabs)/contact/index.tsx` - Contact info buttons
- **Fix:** Add to all Pressable/Button components:
  ```typescript
  <Pressable
    accessible={true}
    accessibilityLabel="Go back to previous screen"
  >
  ```

### 32. Tab Bar Labels Missing for Some Tabs
- **File:** `app/(tabs)/_layout.tsx`
- **Issue:** 
  - `home`, `events`, `resources`, `about` have no `title`, so labels default to directory name
  - `foryou` has "For You" (good)
  - `contact` has "contact" (lowercase, inconsistent)
- **Fix:** Set `title` option for all tabs

### 33. Hardcoded Width "350" Overflows on Narrow Screens
- **File:** `src/styleFactory.ts:107`
- **Code:** `width: 350` for "who are you" options
- **Issue:** Overflows on phones < 375px width
- **Fix:** Use dynamic width:
  ```typescript
  width: screenWidth * 0.9, // or useWindowDimensions
  maxWidth: 350,
  ```

### 34. Hardcoded Width "47%" Layout Issues
- **File:** `app/(tabs)/foryou/index.tsx:74`
- **Code:** `style={{ width: "47%", height: 110 }}`
- **Issue:** 6 items with gap of 10 don't reliably fill rows on all widths. Last row misaligns on tablets.
- **Fix:** Use FlatList with `numColumns={2}` for better responsive layout

---

## 🟣 INCONSISTENCIES & CODE QUALITY

### 35. Duplicate Color Constants Defined in Multiple Files
- **Same `lightRed` constant in:**
  - `app/(tabs)/home/index.tsx:20`
  - `app/(tabs)/contact/index.tsx:11`
  - `src/components/LatestEvents.tsx:4`
  - `src/components/RecentFeed.tsx:13`
- **Fix:** Move to `src/theme.ts`:
  ```typescript
  export const theme = {
    red: "hsl(4, 74.2%, 51.9%)",
    lightRed: "hsl(4, 65%, 50%)",
    // ...
  };
  ```

### 36. Three Different Red Colors Used Inconsistently
- **"rgb(225,0,0)"** - some screens
- **`theme.sectionHeadingColor`** = `"hsl(4, 84.2%, 41.9%)"` - darker red
- **`theme.red`** = `"hsl(4, 74.2%, 51.9%)"` - medium red
- **Fix:** Standardize on one primary red in theme

### 37. LatestFeedItemSchema Doesn't Coerce Date Strings
- **File:** `src/types/latestFeed.ts:7-8`
- **Code:** `start: z.string().nullable(), end: z.string().nullable()`
- **Issue:** Unlike all other schemas using `z.coerce.date()`, these stay as raw strings. Consumers must parse manually.
- **Fix:** Change to `z.coerce.date().nullable()` if fields represent dates

### 38. ArticleDetailSchema Missing publishedAt Field
- **File:** `src/types/article.ts`
- **Issue:** 
  - `ArticleListItemSchema` includes `publishedAt: z.coerce.date()`
  - `ArticleDetailSchema` does NOT
- **Fix:** Add `publishedAt` to detail schema for consistency

### 39. ApiMeta Import Inconsistency
- **`import type { ApiMeta }`** in 3 files (audience-filtered endpoints)
- **`import { ApiMeta }`** in 5 other files
- **Fix:** All should use `import type` since it's only used as a type

### 40. Query Key Structure Inconsistency
- **Issue:** `events.all()` returns `["events"]` (namespace key) but is used as specific query for all events. Creates confusion on invalidation behavior.
- **Fix:** Clarify naming and add `audience.all()` for cascade invalidation:
  ```typescript
  audience: {
    all: () => ["audience"] as const,
    detail: (name: string) => ["audience", "detail", name] as const,
    // ...
  }
  ```

### 41. Unused/Dead Code
- **Unused variable:** `screenWidth` in `src/components/Team.tsx:6` and `Director.tsx:6`
- **Unused variable:** `globalStyles` in `app/_layout.tsx:43`
- **Unused imports:** `Event` type in `src/api/fetchEvent.ts:2`
- **Unused components:** `LatestEvents.tsx` and `Events.tsx` never imported
- **Unused font:** `GloriaHallelujah_400Regular` referenced in `theme.ts:13` but not loaded in `useFonts()`
- **Fix:** Remove all unused code

### 42. Inconsistent Back Navigation Pattern
- Some screens use `router.back()`
- Some don't have back button (ForStudent screen)
- Detail screens all implement independently
- **Fix:** Create shared `BackButton` component

---

## 📋 SUMMARY BY FILE TYPE

### API Functions (src/api/) - 17 files
| Issue | Count | Severity |
|-------|-------|----------|
| No HTTP status checking | 17 | HIGH |
| Missing request timeout | 17 | HIGH |
| Missing network error handling | 17 | HIGH |
| Type-cast instead of validation | 2 | HIGH |
| Inconsistent patterns | 16 | MEDIUM |
| Duplicate refreshTime constant | 12 | MEDIUM |

### Components (src/components/) - 16 files
| Issue | Count | Severity |
|-------|-------|----------|
| styleFactory() called per render | 16 | MEDIUM |
| Missing accessibility labels | 16 | MEDIUM |
| No error handling | ~10 | HIGH |
| Unused variables | 2 | LOW |

### Screens (app/) - ~20 files
| Issue | Count | Severity |
|-------|-------|----------|
| Invalid/missing ID validation | 4 | HIGH |
| Stale Dimensions on rotation | 5 | MEDIUM |
| Hooks in JSX (Rules violation) | 3 | CRITICAL |
| Inline renderItem without memoization | 3 | MEDIUM |
| Missing error states | 4 | HIGH |
| Hardcoded colors/strings | 20+ | LOW |

---

## 🎯 RECOMMENDATIONS - Priority Order

1. **Week 1 - Critical Crashes:**
   - Fix comma operator bug in Director.tsx
   - Fix Events.tsx import paths
   - Add try/catch to JSON.parse calls
   - Remove/fix broken workshop route
   - Fix Rules of Hooks violations (useAnimatedScrollHandler)

2. **Week 1 - Security:**
   - Add HTTP status checking to all API calls
   - Switch to HTTPS production API URL
   - Remove/validate hardcoded IP addresses

3. **Week 2 - UX/Performance:**
   - Add error boundaries
   - Fix battery-draining refresh intervals
   - Implement registration form submission
   - Add request timeouts and network error handling

4. **Week 2-3 - Accessibility:**
   - Add accessibilityLabel to all interactive elements
   - Fix tab bar titles
   - Improve responsive breakpoints

5. **Week 3 - Code Quality:**
   - Extract duplicate constants to theme.ts
   - Consolidate API patterns
   - Remove console.logs
   - Fix useEffect dependencies
   - Move styleFactory outside components

6. **Week 4+ - Cleanup:**
   - Remove unused code
   - Standardize type usage
   - Create reusable layout components
   - Consider i18n for hardcoded strings

---

## 📊 Statistics

- **Total Issues Found:** 42
- **Critical:** 8 (crashes/broken features)
- **High:** 9 (security/UX/network)
- **Medium:** 15 (performance/quality)
- **Low:** 12 (cleanup/consistency)

**Most Impactful Fixes:**
1. HTTP status checking (affects 17 files, prevents crashes)
2. Remove battery-draining refetch (affects 12+ hooks, significant UX impact)
3. Add error boundaries (prevents app-wide crashes)
4. Add request timeouts (prevents hanging requests)
5. Fix type inconsistencies across schemas

