import Animated, { SlideInDown } from "react-native-reanimated";
import { theme } from "../theme";
import { Text, Pressable, View } from "react-native";
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
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: theme.backgroundColorLight,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.06)",
      }}
    >
      <Pressable
        onPress={() => setPage((p: number) => p - 1)}
        disabled={page === 1}
        style={({ pressed }) => [
          {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: page === 1 ? "hsl(0, 0%, 95%)" : theme.red,
            elevation: page === 1 ? 0 : 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: page === 1 ? 0 : 0.1,
            shadowRadius: 2,
          },
          pressed && page !== 1 && { opacity: 0.88, transform: [{ scale: 0.95 }] },
        ]}
      >
        <ChevronLeft size={22} color={page === 1 ? "hsl(0, 0%, 65%)" : "white"} strokeWidth={3} />
      </Pressable>

      <Text
        style={{
          color: "hsl(0, 0%, 30%)",
          fontFamily: theme.fontBold,
          fontSize: 16,
          letterSpacing: 0.5,
        }}
      >
        {totalPages > 0 ? `${page} / ${totalPages}` : "—"}
      </Text>

      <Pressable
        onPress={() => setPage((p: number) => p + 1)}
        disabled={page >= totalPages}
        style={({ pressed }) => [
          {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: page >= totalPages ? "hsl(0, 0%, 95%)" : theme.red,
            elevation: page >= totalPages ? 0 : 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: page >= totalPages ? 0 : 0.1,
            shadowRadius: 2,
          },
          pressed && page < totalPages && { opacity: 0.88, transform: [{ scale: 0.95 }] },
        ]}
      >
        <ChevronRight size={22} color={page >= totalPages ? "hsl(0, 0%, 65%)" : "white"} strokeWidth={3} />
      </Pressable>
    </Animated.View>
  );
}
