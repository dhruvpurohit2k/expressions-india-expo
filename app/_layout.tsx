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
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
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

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={theme.sectionHeadingColor} style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
