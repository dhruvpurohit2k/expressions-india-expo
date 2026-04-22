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
  event: <CalendarDays size={18} color="white" strokeWidth={2} />,
  podcast: <Headphones size={18} color="white" strokeWidth={2} />,
  article: <FileText size={18} color="white" strokeWidth={2} />,
  journal: <BookOpen size={18} color="white" strokeWidth={2} />,
  course: <GraduationCap size={18} color="white" strokeWidth={2} />,
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
        <View
          style={{
            gap: 8,
            backgroundColor: "hsl(0 0% 97%)",
            borderRadius: 5,
          }}
        >
          {data.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(400).delay(i * 70)}
              style={[
                {
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  borderBottomColor: "hsl(0 0% 90%)",
                  borderTopColor: "hsl(0 0% 90%)",
                  padding: 1,
                },
              ]}
            >
              <Pressable
                onPress={() => navigateTo(item)}
                style={({ pressed }) => ({
                  // backgroundColor: theme.backgroundColor,
                  borderRadius: 12,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 5,
                    backgroundColor: lightRed,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {TYPE_ICON[item.type]}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: theme.font,
                      fontSize: 14,
                      color: theme.text,
                      lineHeight: 20,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.font,
                      fontSize: 11,
                      color: "hsl(0,0%,55%)",
                      marginTop: 2,
                    }}
                  >
                    {TYPE_LABEL[item.type]}
                  </Text>
                </View>

                {formatDate(item.start) && (
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: theme.fontBold,
                      color: theme.red,
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(item.start)}
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
}
