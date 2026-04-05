import { theme } from "@/src/theme";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

type Option = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
  code: string;
  bg: string;
  iconColor: string;
};

const options: Option[] = [
  {
    icon: "school-outline",
    text: "Student",
    code: "student",
    bg: "#fdeced",
    iconColor: theme.red,
  },
  {
    icon: "book-outline",
    text: "Teacher",
    code: "teacher",
    bg: "#e8f1fd",
    iconColor: "#2563eb",
  },
  {
    icon: "people-outline",
    text: "Parent",
    code: "parent",
    bg: "#e8f8f0",
    iconColor: "#16a34a",
  },
  {
    icon: "chatbubbles-outline",
    text: "Counselor",
    code: "counselor",
    bg: "#f0ebff",
    iconColor: "#7c3aed",
  },
  {
    icon: "business-outline",
    text: "Head of School",
    code: "head_of_department",
    bg: "#fef3e2",
    iconColor: "#d97706",
  },
  {
    icon: "briefcase-outline",
    text: "Mental Health Professional",
    code: "mental_health_professional",
    bg: "#e6f7f7",
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
      entering={FadeInDown.duration(500).delay(delay)}
      style={{ width: "47%", height: 110 }}
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
                },
                pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
              ]}
            >
              <View
                style={{
                  width: iconSize + 16,
                  height: iconSize + 16,
                  borderRadius: (iconSize + 16) / 2,
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
                  fontSize: 13,
                  color: "hsl(0,0%,20%)",
                  lineHeight: 18,
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <Text
        style={{
          marginHorizontal: 18,
          marginTop: 74,
          marginBottom: 18,
          fontSize: 32,
          // fontFamily: theme.fontBold,
          color: theme.sectionHeadingColor,
        }}
      >
        Who are you?
      </Text>

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
            iconSize={28}
            delay={index * 80}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
