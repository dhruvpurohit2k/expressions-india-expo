import { theme } from "@/src/theme";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, { ZoomIn } from "react-native-reanimated";
import { styleFactory } from "@/src/styleFactory";

type Option = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
  code: string;
  bg: string;
  iconColor: string;
};

const options: Option[] = [
  {
    icon: "chatbubbles-outline",
    text: "Counselor\n(School and University)",
    code: "counselor",
    bg: "#f5f2ff",
    iconColor: "#7c3aed",
  },
  {
    icon: "school-outline",
    text: "Student",
    code: "student",
    bg: "#fff2f2",
    iconColor: "#e53935",
  },
  {
    icon: "people-outline",
    text: "Parents And Family",
    code: "parent",
    bg: "#f0faf4",
    iconColor: "#16a34a",
  },
  {
    icon: "book-outline",
    text: "Teacher",
    code: "teacher",
    bg: "#f0f6ff",
    iconColor: "#2563eb",
  },
  {
    icon: "business-outline",
    text: "Head of Institute",
    code: "head_of_department",
    bg: "#fffaf0",
    iconColor: "#d97706",
  },
  {
    icon: "briefcase-outline",
    text: "Mental Health Professional & Others",
    code: "mental_health_professional",
    bg: "#f0fbfb",
    iconColor: "#0d9488",
  },
];

function BentoCard({
  option,
  iconSize,
  delay,
}: {
  option: Option;
  iconSize: number;
  delay: number;
}) {
  return (
    <Animated.View
      entering={ZoomIn.duration(500).delay(delay)}
      style={{ width: "47%", height: 160 }}
    >
      <Link href={`/audience/${option.code}`} asChild>
        <Pressable style={{ flex: 1 }}>
          {({ pressed }) => (
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: option.bg,
                  borderRadius: 12,
                  padding: 18,
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: option.iconColor + "14",
                  shadowColor: option.iconColor,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 5,
                  elevation: 1,
                },
                pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
              ]}
            >
              <View
                style={{
                  width: iconSize + 22,
                  height: iconSize + 22,
                  borderRadius: (iconSize + 22) / 2,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={option.icon}
                  size={iconSize}
                  color={option.iconColor}
                />
              </View>
              <Text
                style={{
                  fontFamily: theme.fontBold,
                  fontSize: 14,
                  color: "hsl(0,0%,20%)",
                  lineHeight: 20,
                }}
              >
                {option.text}
              </Text>
            </View>
          )}
        </Pressable>
      </Link>
    </Animated.View>
  );
}

export default function ForYou() {
  const globalStyle = styleFactory();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[globalStyle.screen]} edges={["left", "right"]}>
      <StatusBar style="light" />
      <View
        style={{
          backgroundColor: "hsla(4, 72%, 52%, 0.94)",
          paddingTop: insets.top + 18,
          paddingBottom: 22,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.15)",
          marginBottom: 28,
        }}
      >
        <Text
          style={{
            fontSize: 38,
            fontFamily: theme.fontBold,
            color: "white",
          }}
        >
          Who are you?
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
          paddingHorizontal: 14,
          gap: 10,
        }}
      >
        {options.map((option, index) => (
          <BentoCard
            key={option.code}
            option={option}
            iconSize={42}
            delay={index * 80}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
