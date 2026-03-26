import { useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useLayoutEffect } from "react";

export default function EventLayout() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  }, [navigation]);
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="pastevents" options={{ headerShown: false }} />
    </Stack>
  );
}
