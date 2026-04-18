import { useArticle } from "@/src/hooks/useArticle";
import { useIsFocused } from "@react-navigation/native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const {
    data: article,
    isLoading,
    error,
  } = useArticle(id, { enabled: isFocused });

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
    <SafeAreaView style={globalStyle.screen}>
      {/* Back button */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8, backgroundColor: "hsl(0, 0%, 95%)" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <ChevronLeft size={24} color={theme.text} strokeWidth={2} />
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
                height: SCREEN_WIDTH * 0.6,
                resizeMode: "cover",
                backgroundColor: theme.backgroundColorDark,
              }}
            />
          </Animated.View>
        )}

        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
          {/* Category chip */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={{
              alignSelf: "flex-start",
              backgroundColor: theme.red + "18",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 4,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontFamily: theme.fontBold,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {article.category}
            </Text>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInDown.duration(450).delay(160)}
            style={{
              fontSize: 26,
              fontFamily: theme.fontBold,
              color: theme.sectionHeadingColor,
              lineHeight: 34,
              marginBottom: 8,
            }}
          >
            {article.title}
          </Animated.Text>

          {/* Date */}
          <Animated.Text
            entering={FadeInDown.duration(400).delay(220)}
            style={{
              fontSize: 12,
              color: "hsl(0,0%,55%)",
              fontFamily: theme.font,
              marginBottom: 24,
            }}
          >
            {format(article.createdAt, "do MMMM yyyy")}
          </Animated.Text>

          {/* Divider */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(280)}
            style={{
              height: 2,
              width: 40,
              backgroundColor: theme.red,
              borderRadius: 2,
              marginBottom: 24,
            }}
          />

          {/* Content paragraphs */}
          {paragraphs.map((para, i) => (
            <Animated.Text
              key={i}
              entering={FadeInUp.duration(450).delay(300 + i * 60)}
              style={{
                fontSize: 15,
                color: theme.text,
                fontFamily: theme.font,
                lineHeight: 26,
                marginBottom: 18,
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
                  fontSize: 13,
                  fontFamily: theme.fontBold,
                  color: "hsl(0,0%,45%)",
                  letterSpacing: 0.8,
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
