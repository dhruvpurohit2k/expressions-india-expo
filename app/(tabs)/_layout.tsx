import { Tabs } from "expo-router";
import { theme } from "@/src/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

function PillTabButton(props: any) {
  const focused = props.accessibilityState?.selected ?? false;
  const opacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Pressable
      {...props}
      style={[
        props.style,
        { flex: 1, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 5,
            bottom: 5,
            left: 4,
            right: 4,
            borderRadius: 16,
            backgroundColor: theme.red,
          },
          pillStyle,
        ]}
      />
      {props.children}
    </Pressable>
  );
}

export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 0,
          borderRadius: 20,
          // Floating shadow — single source for the whole bottom panel
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        tabBarActiveBackgroundColor: theme.red,
        tabBarInactiveBackgroundColor: theme.backgroundColorLight,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "hsl(0,0%,55%)",
        tabBarButton: (props) => <PillTabButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          headerShown: false,
          title: "Events",
          popToTopOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-clear-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          headerShown: false,
          title: "Resources",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="foryou"
        options={{
          title: "For You",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          headerShown: false,
          title: "Courses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerShown: false,
          title: "About",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="key-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
