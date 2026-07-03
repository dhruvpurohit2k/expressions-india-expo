import { theme } from "@/src/theme";
import { Delius_400Regular } from "@expo-google-fonts/delius";
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback, Component } from "react";
import { AppState, Image, Platform, View, Text, ScrollView, StatusBar as RNStatusBar } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageProvider } from "@/src/context/imageContext";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { styleFactory } from "@/src/styleFactory";
import SplashScreen from "@/src/components/SplashScreen";
import OnboardingScreen from "@/src/components/onboarding/OnboardingScreen";
import { hasCompletedOnboarding } from "@/src/lib/storage";
import { initPurchases } from "@/src/lib/purchases";

function BottomSystemBar() {
  const insets = useSafeAreaInsets();
  if (insets.bottom === 0) return null;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: insets.bottom,
        backgroundColor: "#ffffff",
      }}
    />
  );
}

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
          <Text style={{ color: "red", fontSize: 18, fontWeight: "bold", marginTop: 60 }}>
            App Error
          </Text>
          <Text style={{ color: "#333", marginTop: 12, fontSize: 14 }}>
            {err.message}
          </Text>
          <Text style={{ color: "#999", marginTop: 12, fontSize: 11 }}>
            {err.stack}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener("change", (state) => {
    if (Platform.OS !== "web") {
      handleFocus(state === "active");
    }
  });
  return () => subscription.remove();
});

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 300_000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: refreshTime,
      refetchOnWindowFocus: false,
    },
  },
});

type BootState = "splash" | "checking" | "onboarding" | "app";

// Survives component remounts (e.g. web tab navigation) so splash only runs once.
let _cachedBootState: BootState | null = null;

export default function RootLayout() {
  const globalStyles = styleFactory();
  const [appState, setAppState] = useState<BootState>(_cachedBootState ?? "splash");

  function updateAppState(next: BootState) {
    _cachedBootState = next;
    setAppState(next);
  }
  const [loaded] = useFonts({
    Delius_400Regular,
    Inter_700Bold,
    Inter_400Regular,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#ffffff").catch(() => {});

    // Initialize purchases (stub mode in Phase 1)
    initPurchases();
  }, []);

  const handleSplashFinish = useCallback(async () => {
    updateAppState("checking");
    const done = await hasCompletedOnboarding();
    updateAppState(done ? "app" : "onboarding");
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    updateAppState("app");
  }, []);

  if (!loaded) {
    return null;
  }

  if (appState === "splash") {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Brief gap while reading SecureStore — mirrors the native splash screen
  // so there's no visible transition before the animated splash starts.
  if (appState === "checking") {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (appState === "onboarding") {
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
    <ImageProvider>
    <SafeAreaProvider>
      <RNStatusBar backgroundColor="#ffffff" barStyle="dark-content" translucent />
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                gestureEnabled: true,
                fullScreenGestureEnabled: true,
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="modal" options={{ headerShown: false }} />
              <Stack.Screen name="event" options={{ headerShown: false }} />
              <Stack.Screen name="podcast" options={{ headerShown: false }} />
              <Stack.Screen name="journal" options={{ headerShown: false }} />
              <Stack.Screen name="article" options={{ headerShown: false }} />
              <Stack.Screen
                name="audience/[name]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="registration"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="course" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="oauth2redirect" options={{ headerShown: false }} />
            </Stack>
            <BottomSystemBar />
          </View>
        </QueryClientProvider>
    </SafeAreaProvider>
    </ImageProvider>
    </ErrorBoundary>
  );
}
