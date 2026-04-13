import { Stack } from "expo-router";

export default function AudienceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="events" />
      <Stack.Screen name="articles" />
      <Stack.Screen name="podcasts" />
      <Stack.Screen name="courses" />
    </Stack>
  );
}
