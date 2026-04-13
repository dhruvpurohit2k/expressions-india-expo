import { Stack } from "expo-router";

export default function CourseDetailLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chapter/[chapterId]" options={{ headerShown: false }} />
    </Stack>
  );
}
