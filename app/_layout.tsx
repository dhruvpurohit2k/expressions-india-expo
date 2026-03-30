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
import { ImageProvider } from "@/src/context/imageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { styleFactory } from "@/src/styleFactory";
export default function RootLayout() {
  const globalStyles = styleFactory();
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

  const queryClient = new QueryClient();
  if (!loaded) {
    return null;
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
            <Stack.Screen name="workshop" options={{ headerShown: false }} />
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
