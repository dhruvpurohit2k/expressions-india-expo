import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { theme } from "../theme";
import {
  CalendarDays,
  Headphones,
  FileText,
  BookOpen,
  GraduationCap,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useLatestFeed } from "../hooks/useLatestFeed";
import { useIsFocused  } from "expo-router";
import { LatestFeedItem } from "../types/latestFeed";
import { router } from "expo-router";

const lightRed = "hsl(4, 65%, 56%)";

type IconComponent = typeof CalendarDays;

const TYPE_META: Record<
  LatestFeedItem["type"],
  { label: string; color: string; tint: string; cardTint: string; Icon: IconComponent }
> = {
  event: {
    label: "Event",
    color: "rgb(220,38,38)",
    tint: "rgba(220,38,38,0.10)",
    cardTint: "rgba(220,38,38,0.04)",
    Icon: CalendarDays,
  },
  podcast: {
    label: "Podcast",
    color: "rgb(124,58,237)",
    tint: "rgba(124,58,237,0.10)",
    cardTint: "rgba(124,58,237,0.04)",
    Icon: Headphones,
  },
  article: {
    label: "Article",
    color: "rgb(37,99,235)",
    tint: "rgba(37,99,235,0.10)",
    cardTint: "rgba(37,99,235,0.04)",
    Icon: FileText,
  },
  journal: {
    label: "Journal",
    color: "rgb(22,163,74)",
    tint: "rgba(22,163,74,0.10)",
    cardTint: "rgba(22,163,74,0.04)",
    Icon: BookOpen,
  },
  course: {
    label: "Course",
    color: "rgb(217,119,6)",
    tint: "rgba(217,119,6,0.10)",
    cardTint: "rgba(217,119,6,0.04)",
    Icon: GraduationCap,
  },
};

function navigateTo(item: LatestFeedItem) {
  switch (item.type) {
    case "event":
      router.push({ pathname: "/event/[id]", params: { id: item.id } });
      break;
    case "podcast":
      router.push({ pathname: "/podcast/[id]", params: { id: item.id } });
      break;
    case "article":
      router.push({ pathname: "/article/[id]", params: { id: item.id } });
      break;
    case "journal":
      router.push({ pathname: "/journal/[id]", params: { id: item.id } });
      break;
    case "course":
      router.push({ pathname: "/course/[id]", params: { id: item.id } });
      break;
  }
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export default function RecentFeed() {
  const isFocused = useIsFocused();
  const { data, isPending, isError } = useLatestFeed({ enabled: isFocused });

  return (
    <View style={{ paddingHorizontal: 15, marginTop: 24, marginBottom: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            width: 3,
            height: 20,
            backgroundColor: lightRed,
            borderRadius: 2,
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: lightRed,
            letterSpacing: 0.3,
          }}
        >
          Recent Additions
        </Text>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: lightRed,
            opacity: 0.22,
          }}
        />
      </View>

      {isPending ? (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <ActivityIndicator size="small" color={theme.red} />
        </View>
      ) : isError || !data?.length ? (
        <Text
          style={{
            fontFamily: theme.font,
            fontSize: 13,
            color: "hsl(0,0%,55%)",
            textAlign: "center",
            paddingVertical: 16,
          }}
        >
          No recent additions.
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {data.map((item, i) => {
            const meta = TYPE_META[item.type];
            const Icon = meta.Icon;
            return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(400).delay(i * 70)}
              style={{
                backgroundColor: meta.cardTint,
                borderRadius: 10,
              }}
            >
              <Pressable
                onPress={() => navigateTo(item)}
                style={({ pressed }) => ({
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: meta.tint,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={meta.color} strokeWidth={2} />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: theme.text,
                      fontSize: 15,
                      color: theme.text,
                      lineHeight: 21,
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: meta.tint,
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: theme.fontBold,
                          fontSize: 10,
                          color: meta.color,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {meta.label}
                      </Text>
                    </View>
                    {formatDate(item.start) && (
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: theme.font,
                          color: "hsl(0,0%,58%)",
                        }}
                      >
                        {formatDate(item.start)}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            </Animated.View>
            );
          })}
        </View>
      )}
    </View>
  );
}
