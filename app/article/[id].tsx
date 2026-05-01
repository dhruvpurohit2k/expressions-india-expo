import { useArticle } from "@/src/hooks/useArticle";
import { useIsFocused } from "@react-navigation/native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAX_COVER_HEIGHT = SCREEN_WIDTH * 1.4;

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const {
    data: article,
    isLoading,
    error,
  } = useArticle(id, { enabled: isFocused });

  const [coverAspect, setCoverAspect] = useState<number | null>(null);

  useEffect(() => {
    const url = article?.medias[0]?.url;
    if (!url) return;
    Image.getSize(
      url,
      (w, h) => setCoverAspect(w / h),
      () => { },
    );
  }, [article?.medias[0]?.url]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.red} />
        <Text style={[globalStyle.text, { marginTop: 12 }]}>
          Loading article...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !article) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center", padding: 20 },
        ]}
      >
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          {error ? "Could not load article" : "Article not found"}
        </Text>
      </SafeAreaView>
    );
  }

  const coverImage = article.medias[0] ?? null;
  const extraImages = article.medias.slice(1);
  const paragraphs = article.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SafeAreaView style={globalStyle.screen} edges={["left", "right", "bottom"]}>
      {/* Back button */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingTop: insets.top + 10,
          backgroundColor: theme.red,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8 },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={24} color="white" strokeWidth={2} />
        </Pressable>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover image */}
        {coverImage && (
          <Animated.View entering={SlideInRight.duration(500)}>
            <Image
              source={{ uri: coverImage.url }}
              style={{
                width: SCREEN_WIDTH,
                height: coverAspect
                  ? Math.min(SCREEN_WIDTH / coverAspect, MAX_COVER_HEIGHT)
                  : SCREEN_WIDTH * 0.6,
                resizeMode: "contain",
                backgroundColor: theme.backgroundColorDark,
              }}
            />
          </Animated.View>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          {/* Title */}
          <Animated.Text
            entering={FadeInDown.duration(450).delay(100)}
            style={{
              fontSize: 26,
              fontFamily: theme.fontBold,
              color: theme.sectionHeadingColor,
              lineHeight: 36,
              marginBottom: 8,
            }}
          >
            {article.title}
          </Animated.Text>

          {/* Author */}
          {article.author ? (
            <Animated.Text
              entering={FadeInDown.duration(400).delay(180)}
              style={{
                fontSize: 12,
                color: "rgba(200,0,0,0.72)",
                fontFamily: theme.fontBold,
                letterSpacing: 0.3,
                marginBottom: 4,
              }}
            >
              {article.author}
            </Animated.Text>
          ) : null}

          {/* Date */}
          <Animated.Text
            entering={FadeInDown.duration(400).delay(240)}
            style={{
              fontSize: 13,
              color: "hsl(0,0%,58%)",
              fontFamily: theme.font,
              letterSpacing: 0.2,
              marginBottom: 26,
            }}
          >
            {format(article.createdAt, "do MMMM yyyy")}
          </Animated.Text>

          {/* Divider */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(280)}
            style={{
              height: 2,
              width: 52,
              backgroundColor: theme.red,
              borderRadius: 2,
              marginBottom: 26,
            }}
          />

          {/* Content paragraphs */}
          {paragraphs.map((para, i) => (
            <Animated.Text
              key={i}
              entering={FadeInUp.duration(450).delay(300 + Math.min(i, 5) * 60)}
              style={{
                fontSize: i === 0 ? 15 : 15,
                color: i === 0 ? "hsl(0,0%,25%)" : theme.text,
                fontFamily: i === 0 ? theme.font : theme.font,
                lineHeight: i === 0 ? 28 : 26,
                marginBottom: 20,
                textAlign: "justify",
              }}
            >
              {para}
            </Animated.Text>
          ))}

          {/* Extra images gallery */}
          {extraImages.length > 0 && (
            <Animated.View
              entering={FadeInUp.duration(450).delay(400)}
              style={{ marginTop: 8 }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: theme.fontBold,
                  color: theme.red,
                  letterSpacing: 0.9,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Photos
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {extraImages.map((m) => (
                  <Image
                    key={m.id}
                    source={{ uri: m.url }}
                    style={{
                      width: (SCREEN_WIDTH - 36 - 6) / 2,
                      aspectRatio: 1,
                      borderRadius: 8,
                      backgroundColor: theme.backgroundColorDark,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
