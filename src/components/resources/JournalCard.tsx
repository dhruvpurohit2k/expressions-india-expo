import Animated, { SlideInDown } from "react-native-reanimated";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import type { JournalListItem } from "@/src/types/journal";

export const JournalCard = memo(function JournalCard({
  item,
  index,
}: {
  item: JournalListItem;
  index: number;
}) {
  return (
    <Animated.View
      entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 60)}
    >
      <Link href={`/journal/${item.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <View
              style={[
                {
                  borderBottomWidth: 1,
                  borderColor: "hsl(0, 0%, 90%)",
                  padding: 12,
                },
                pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 15,
                  color: "hsl(0, 0%, 30%)",
                  marginBottom: 6,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "hsl(0, 100%, 50%)",
                  textAlign: "right",
                }}
              >
                {item.startMonth}–{item.endMonth} {item.year}
              </Text>
            </View>
          )}
        </Pressable>
      </Link>
    </Animated.View>
  );
});
