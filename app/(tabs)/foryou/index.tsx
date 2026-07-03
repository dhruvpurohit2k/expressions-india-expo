import { theme } from "@/src/theme";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, ScrollView } from "react-native";
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
                  borderRadius: 20,
                  padding: 18,
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.03)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.02,
                  shadowRadius: 6,
                  elevation: 1,
                },
                pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
              ]}
            >
              <View
                style={{
                  width: iconSize + 16,
                  height: iconSize + 16,
                  borderRadius: (iconSize + 16) / 2,
                  backgroundColor: "#ffffff",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Ionicons
                  name={option.icon}
                  size={iconSize - 4}
                  color={option.iconColor}
                />
              </View>
              <Text
                style={{
                  fontFamily: theme.fontBold,
                  fontSize: 14,
                  color: theme.textPrimary,
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
      <StatusBar style="dark" />
      <View
        style={{
          backgroundColor: theme.backgroundColorLight,
          paddingTop: insets.top + 18,
          paddingBottom: 22,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.06)",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 38,
            fontFamily: theme.fontBold,
            color: theme.redMuted,
          }}
        >
          Who are you?
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: 32,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
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
      </ScrollView>
    </SafeAreaView>
  );
}
