import { Stack } from "expo-router";

export default function ForYouLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="forStudent" options={{ headerShown: false }} />
    </Stack>
  );
}
