import Animated, { SlideInDown } from "react-native-reanimated";
import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { theme } from "@/src/theme";
import { formatDate } from "@/src/utils/date";
import { tileColor } from "@/src/utils/tileColor";
import type { ArticleListItem } from "@/src/types/article";

export const ArticleCard = memo(function ArticleCard({
  item,
  index,
}: {
  item: ArticleListItem;
  index: number;
}) {
  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 60)}
    >
      <Link href={`/article/${item.id}`} asChild>
        <Pressable style={{ flex: 1 }}>
          {({ pressed }) => (
            <View
              style={[
                {
                  backgroundColor: tileColor(item.id),
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
              {item.thumbnailUrl ? (
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={{ width: "100%", aspectRatio: 1 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ width: "100%", aspectRatio: 1 }} />
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
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}
                >
                  {item.author ? (
                    <View
                      style={{
                        backgroundColor: "transparent",
                        borderRadius: 5,
                        paddingHorizontal: 6,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: theme.red,
                          fontFamily: theme.fontBold,
                        }}
                      >
                        {`By - ${item.author}`}
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: theme.backgroundColor,
                      borderRadius: 5,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      marginLeft: "auto",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: "hsl(0,0%,25%)",
                        fontFamily: theme.font,
                      }}
                    >
                      {formatDate(item.publishedAt)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </Link>
    </Animated.View>
  );
});
