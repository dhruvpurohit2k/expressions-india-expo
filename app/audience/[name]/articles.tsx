import { useArticlesByAudience } from "@/src/hooks/useArticlesByAudience";
import { AUDIENCE_LABELS } from "@/src/types/audience";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams, Link } from "expo-router";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, SlideInDown } from "react-native-reanimated";

const LIMIT = 10;

export default function AudienceArticles() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const globalStyle = styleFactory();
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();

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
    <SafeAreaView style={globalStyle.screen}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8, backgroundColor: "hsl(0,0%,95%)" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <ChevronLeft size={24} color={theme.text} strokeWidth={2} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.sectionHeadingColor,
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
          contentContainerStyle={{ paddingHorizontal: 15, gap: 10, paddingBottom: 12 }}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 70)}>
              <Link href={`/article/${item.id}`} asChild>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: theme.backgroundColorLight,
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
                      style={{ width: 88, height: 88, resizeMode: "cover" }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 88,
                        height: 88,
                        backgroundColor: theme.backgroundColorDark,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>📄</Text>
                    </View>
                  )}
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
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ backgroundColor: theme.red + "18", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 10, color: theme.red, fontFamily: theme.fontBold }}>{item.category}</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: "hsl(0,0%,55%)", fontFamily: theme.font }}>
                        {format(item.createdAt, "do MMM yyyy")}
                      </Text>
                    </View>
                  </View>
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
