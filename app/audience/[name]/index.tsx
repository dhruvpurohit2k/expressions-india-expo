import { useAudience } from "@/src/hooks/useAudience";
import { AUDIENCE_LABELS } from "@/src/types/audience";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams, Link } from "expo-router";
import {
  Newspaper,
  Headphones,
  Award,
  ChevronLeft,
  Calendar,
} from "lucide-react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

const SECTION_CARDS = [
  {
    key: "events",
    label: "Events",
    description: "Upcoming events curated for you",
    icon: Calendar,
    color: "#ef4444",
    bg: "#fee2e2",
  },
  {
    key: "articles",
    label: "Articles",
    description: "Reads selected for your journey",
    icon: Newspaper,
    color: "#0891b2",
    bg: "#ecf0ff",
  },
  {
    key: "podcasts",
    label: "Podcasts",
    description: "Listen to expert conversations",
    icon: Headphones,
    color: "#7c3aed",
    bg: "#f3e8ff",
  },
  // {
  //   key: "courses",
  //   label: "Courses",
  //   description: "Structured learning paths for you",
  //   icon: Award,
  //   color: "#059669",
  //   bg: "#ecfdf5",
  // },
] as const;

export default function AudiencePage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { data: audience, isLoading } = useAudience(name, {
    enabled: isFocused,
  });

  const label = AUDIENCE_LABELS[name] ?? name;

  return (
    <SafeAreaView style={globalStyle.screen} edges={["left", "right", "bottom"]}>
      {/* Back */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingTop: insets.top + 10,
          gap: 10,
          backgroundColor: theme.red,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8 },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={24} color="white" strokeWidth={2} />
        </Pressable>
        <Text
          style={{
            fontSize: 22,
            fontFamily: theme.fontBold,
            color: "white",
            flex: 1,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={{ minHeight: 200 }}>
          {isLoading ? (
            <View style={{ marginVertical: 16 }}>
              <ActivityIndicator size="small" color={theme.red} />
            </View>
          ) : audience?.introduction ? (
            <Animated.Text
              entering={FadeInDown.duration(400).delay(100)}
              style={{
                fontSize: 15,
                fontFamily: theme.font,
                color: theme.text,
                lineHeight: 24,
                marginBottom: 28,
                marginTop: 8,
                textAlign: "justify",
              }}
            >
              {audience.introduction}
            </Animated.Text>
          ) : (
            <View style={{ height: 24 }} />
          )}
        </View>

        {/* Divider */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{
            height: 2,
            width: 40,
            backgroundColor: theme.red,
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        {/* "Here's what we have for you" */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: theme.text,
            marginBottom: 16,
          }}
        >
          Here's what we have for you
        </Animated.Text>

        {/* Section cards */}
        {SECTION_CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <Animated.View
              key={card.key}
              entering={FadeInUp.duration(450).delay(index * 100)}
            >
              <Link href={`/audience/${name}/${card.key}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View
                      style={[
                        {
                          alignItems: "center",
                          backgroundColor: theme.backgroundColorLight,
                          borderRadius: 18,
                          paddingVertical: 28,
                          paddingHorizontal: 20,
                          marginBottom: 14,
                          elevation: 1,
                        },
                        pressed && {
                          opacity: 0.88,
                          transform: [{ scale: 0.97 }],
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 36,
                          backgroundColor: card.bg,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 14,
                        }}
                      >
                        <Icon size={34} color={card.color} strokeWidth={1.6} />
                      </View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: theme.fontBold,
                          color: theme.sectionHeadingColor,
                          marginBottom: 6,
                          textAlign: "center",
                        }}
                      >
                        {card.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: theme.font,
                          color: "hsl(0,0%,55%)",
                          textAlign: "center",
                        }}
                      >
                        {card.description}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </Link>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
