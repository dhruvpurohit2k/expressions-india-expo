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
          backgroundColor: theme.sectionHeadingColor,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize,
        },
        // tabBarActiveBackgroundColor: theme.sectionHeadingColor,
        tabBarInactiveBackgroundColor: theme.backgroundColor,
        tabBarActiveTintColor: "white",
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
        name="programs"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-clear-outline" color={color} size={size} />
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
