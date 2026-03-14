import { Tabs } from "expo-router";
import { theme } from "@/src/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.backgroundColorLight,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize,
        },
        tabBarActiveBackgroundColor: theme.backgroundColorLight,
        tabBarInactiveBackgroundColor: theme.backgroundColor,
        tabBarActiveTintColor: "#DD6666",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
