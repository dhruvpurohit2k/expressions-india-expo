import { useArticlesByAudience } from "@/src/hooks/useArticlesByAudience";
import { AUDIENCE_LABELS } from "@/src/types/audience";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams, Link } from "expo-router";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { useIsFocused  } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, SlideInDown } from "react-native-reanimated";
import { tileColor } from "@/src/utils/tileColor";

const LIMIT = 10;

export default function AudienceArticles() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const globalStyle = styleFactory();
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useArticlesByAudience({
    audience: name,
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
    enabled: isFocused,
  });

  const articles = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const label = AUDIENCE_LABELS[name] ?? name;

  return (
    <SafeAreaView style={globalStyle.screen} edges={["left", "right", "bottom"]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingTop: insets.top + 10,
          gap: 10,
          backgroundColor: theme.backgroundColorLight,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.06)",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8 },
            pressed && { backgroundColor: "rgba(0,0,0,0.06)" },
          ]}
        >
          <ChevronLeft size={24} color={theme.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.redMuted,
            flex: 1,
          }}
          numberOfLines={1}
        >
          Articles for {label}
        </Text>
      </Animated.View>

      {error && (
        <Text style={{ color: theme.red, paddingHorizontal: 15 }}>
          Could not load articles.
        </Text>
      )}

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={theme.red} />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 15, gap: 10, paddingTop: 12, paddingBottom: 12 }}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 70)}>
              <Link href={`/article/${item.id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                  <View
                    style={[
                      {
                        backgroundColor: tileColor(item.id),
                        borderRadius: 10,
                        overflow: "hidden",
                        elevation: 1,
                        flexDirection: "row",
                      },
                      pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
                    ]}
                  >
                  {item.thumbnailUrl ? (
                    <Image
                      source={{ uri: item.thumbnailUrl }}
                      style={{ width: 120, height: 120, resizeMode: "cover" }}
                    />
                  ) : null}
                  <View style={{ flex: 1, padding: 10, justifyContent: "space-between" }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 14,
                        fontFamily: theme.fontBold,
                        color: "hsl(0,0%,20%)",
                        lineHeight: 19,
                      }}
                    >
                      {item.title}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                      {item.author ? (
                        <Text style={{ fontSize: 11, color: "rgba(200,0,0,0.72)", fontFamily: theme.fontBold, flex: 1 }} numberOfLines={1}>
                          {item.author}
                        </Text>
                      ) : <View style={{ flex: 1 }} />}
                      <Text style={{ fontSize: 10, color: "hsl(0,0%,55%)", fontFamily: theme.font, marginLeft: 8 }}>
                        {format(item.publishedAt, "do MMM yyyy")}
                      </Text>
                    </View>
                  </View>
                  </View>
                  )}
                </Pressable>
              </Link>
            </Animated.View>
          )}
          ListEmptyComponent={
            <Animated.Text
              entering={FadeInUp.duration(400).delay(200)}
              style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}
            >
              No articles for {label}.
            </Animated.Text>
          }
        />
      )}

      {totalPages > 1 && (
        <Animated.View
          entering={FadeInUp.duration(350).delay(100)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.backgroundColorDark,
          }}
        >
          <Pressable
            onPress={() => setPage((p) => p - 1)}
            disabled={page === 1}
            style={({ pressed }) => [
              { flexDirection: "row", alignItems: "center", backgroundColor: theme.red, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, opacity: page === 1 ? 0.35 : 1 },
              pressed && { opacity: 0.75 },
            ]}
          >
            <ChevronLeft size={18} color="white" strokeWidth={2.5} />
            <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14, marginLeft: 2 }}>Prev</Text>
          </Pressable>
          <Text style={{ color: theme.text, fontFamily: theme.font, fontSize: 14 }}>{page} / {totalPages}</Text>
          <Pressable
            onPress={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            style={({ pressed }) => [
              { flexDirection: "row", alignItems: "center", backgroundColor: theme.red, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, opacity: page >= totalPages ? 0.35 : 1 },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14, marginRight: 2 }}>Next</Text>
            <ChevronRight size={18} color="white" strokeWidth={2.5} />
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
