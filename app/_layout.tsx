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
import { useEffect, useState, useCallback } from "react";
import { AppState, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ImageProvider } from "@/src/context/imageContext";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { styleFactory } from "@/src/styleFactory";
import SplashScreen from "@/src/components/SplashScreen";

focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener("change", (state) => {
    if (Platform.OS !== "web") {
      handleFocus(state === "active");
    }
  });
  return () => subscription.remove();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  const globalStyles = styleFactory();
  const [showSplash, setShowSplash] = useState(true);
  const [loaded] = useFonts({
    Delius_400Regular,
    Inter_700Bold,
    Inter_400Regular,
  });
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.backgroundColor);
    NavigationBar.setBackgroundColorAsync(theme.sectionHeadingColor);
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!loaded) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        style="dark"
      />
      <ImageProvider>
        <QueryClientProvider client={queryClient}>
          <Stack>
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
            <Stack.Screen name="workshop" options={{ headerShown: false }} />
            <Stack.Screen name="article" options={{ headerShown: false }} />
            <Stack.Screen
              name="audience/[name]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="registration"
              options={{ headerShown: false }}
            />
          </Stack>
        </QueryClientProvider>
      </ImageProvider>
    </SafeAreaProvider>
  );
}
