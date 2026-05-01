import Animated, { SlideInDown } from "react-native-reanimated";
import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { theme } from "@/src/theme";
import { tileColor } from "@/src/utils/tileColor";
import type { CourseListItem } from "@/src/types/course";

export const CourseCard = memo(function CourseCard({
  item,
  index,
}: {
  item: CourseListItem;
  index: number;
}) {
  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 60)}
    >
      <Link
        href={{ pathname: "/course/[id]", params: { id: item.id } }}
        asChild
      >
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
                  style={{ width: "100%", aspectRatio: 16 / 9 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ width: "100%", aspectRatio: 16 / 9 }} />
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
                {item.audiences.length > 0 && (
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}
                  >
                    {item.audiences.slice(0, 2).map((audience) => (
                      <View
                        key={audience}
                        style={{
                          backgroundColor: theme.red + "18",
                          borderRadius: 5,
                          paddingHorizontal: 6,
                          paddingVertical: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: "white",
                            fontFamily: theme.fontBold,
                            textTransform: "capitalize",
                          }}
                        >
                          {audience}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}
        </Pressable>
      </Link>
    </Animated.View>
  );
});
