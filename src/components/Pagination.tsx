import Animated, { SlideInDown } from "react-native-reanimated";
import { theme } from "../theme";
import { Text, Pressable } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export default function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: any;
}) {
  return (
    <Animated.View
      entering={SlideInDown.duration(550).delay(100)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "rgb(255,240,240)",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 5,
        // borderTopWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 12,
        backgroundColor: theme.backgroundColorLight,
        // borderTopColor: theme.backgroundColorDark,
      }}
    >
      <Pressable
        onPress={() => setPage((p: number) => p - 1)}
        disabled={page === 1}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgb(255,240,240)",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            opacity: page === 1 ? 0.35 : 1,
          },
          pressed && { opacity: 0.75 },
        ]}
      >
        <ChevronLeft size={26} color={theme.red} strokeWidth={2.5} />
      </Pressable>

      <Text
        style={{
          color: "hsl(0 0% 50%)",
          fontFamily: theme.font,
          fontSize: 20,
        }}
      >
        {totalPages > 0 ? `${page} / ${totalPages}` : "—"}
      </Text>

      <Pressable
        onPress={() => setPage((p: number) => p + 1)}
        disabled={page >= totalPages}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgb(255,240,240)",
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            opacity: page >= totalPages ? 0.35 : 1,
          },
          pressed && { opacity: 0.75 },
        ]}
      >
        <ChevronRight size={26} color={theme.red} strokeWidth={2.5} />
      </Pressable>
    </Animated.View>
  );
}
