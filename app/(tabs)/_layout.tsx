import { Tabs } from "expo-router";
import { theme } from "@/src/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

function PillTabButton(props: any) {
  const focused = props.accessibilityState?.selected ?? false;
  const scale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, { damping: 14, stiffness: 180 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
            height: 46,
            left: 4,
            right: 4,
            borderRadius: 16,
            backgroundColor: "hsla(4, 74.2%, 51.9%, 0.15)",
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
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        tabBarActiveBackgroundColor: theme.backgroundColorLight,
        tabBarInactiveBackgroundColor: theme.backgroundColorLight,
        tabBarActiveTintColor: theme.red,
        tabBarButton: (props) => <PillTabButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          headerShown: false,
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
        name="about"
        options={{
          headerShown: false,
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
        name="contact"
        options={{
          headerShown: false,
          title: "contact",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
