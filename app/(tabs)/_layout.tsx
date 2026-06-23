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
  const focused = props['aria-selected'] ?? props.accessibilityState?.selected ?? false;
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
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: "hidden",
          backgroundColor: "transparent",
        },
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: "hsla(4, 72%, 52%, 0.94)",
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
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
          borderBottomWidth: 0,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: "hidden",
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: theme.backgroundColorLight,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
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
          href: null,
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
