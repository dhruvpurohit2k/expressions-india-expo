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
import { useIsFocused } from "@react-navigation/native";
import { LatestFeedItem } from "../types/latestFeed";
import { router } from "expo-router";

const lightRed = "hsl(4, 65%, 50%)";

const TYPE_ICON: Record<LatestFeedItem["type"], React.ReactNode> = {
  event: <CalendarDays size={18} color={theme.red} strokeWidth={2} />,
  podcast: <Headphones size={18} color={theme.red} strokeWidth={2} />,
  article: <FileText size={18} color={theme.red} strokeWidth={2} />,
  journal: <BookOpen size={18} color={theme.red} strokeWidth={2} />,
  course: <GraduationCap size={18} color={theme.red} strokeWidth={2} />,
};

const TYPE_LABEL: Record<LatestFeedItem["type"], string> = {
  event: "Event",
  podcast: "Podcast",
  article: "Article",
  journal: "Journal",
  course: "Course",
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
          gap: 8,
          marginBottom: 14,
          // marginHorizontal: 10,
        }}
      >
        <View
          style={{
            width: 2,
            height: 22,
            backgroundColor: lightRed,
            borderRadius: 2,
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: lightRed,
          }}
        >
          Recent Additions
        </Text>
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
          {data.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(400).delay(i * 70)}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
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
                    backgroundColor: "rgba(200,0,0,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {TYPE_ICON[item.type]}
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
                        backgroundColor: "rgba(200,0,0,0.09)",
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: theme.fontBold,
                          fontSize: 10,
                          color: theme.red,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {TYPE_LABEL[item.type]}
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
          ))}
        </View>
      )}
    </View>
  );
}
