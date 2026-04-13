import Animated, { SlideInDown } from "react-native-reanimated";
import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Mic } from "lucide-react-native";
import { theme } from "@/src/theme";
import { formatDate } from "@/src/utils/date";
import type { PodcastListItem } from "@/src/types/podcast";

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|v=|shorts\/))([^&?/\s]+)/i,
  );
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

export const PodcastCard = memo(function PodcastCard({
  item,
  index,
}: {
  item: PodcastListItem;
  index: number;
}) {
  const thumb = getYouTubeThumbnail(item.link);
  console.log(thumb);
  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 60)}
    >
      <Link href={`/podcast/${item.id}`} asChild>
        <Pressable style={{ flex: 1 }}>
          {({ pressed }) => (
            <View
              style={[
                {
                  backgroundColor: "hsl(0, 0%, 100%)",
                  borderRadius: 12,
                  elevation: 1,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              {thumb ? (
                <Image
                  source={{ uri: thumb }}
                  style={{ width: "100%", aspectRatio: 16 / 9 }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    aspectRatio: 16 / 9,
                    backgroundColor: theme.red + "12",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Mic size={36} color={theme.red} strokeWidth={1.5} />
                </View>
              )}
              <View style={{ padding: 8, gap: 6 }}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 12,
                    fontFamily: theme.fontBold,
                    color: theme.text,
                    lineHeight: 17,
                  }}
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    backgroundColor: theme.red + "12",
                    alignSelf: "flex-start",
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: theme.fontBold,
                      color: "white",
                    }}
                  >
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </Link>
    </Animated.View>
  );
});
