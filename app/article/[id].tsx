import { useArticle } from "@/src/hooks/useArticle";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const { data: article, isLoading, error } = useArticle(id);

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

  // Split content into paragraphs for nicer rendering
  const paragraphs = article.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SafeAreaView style={globalStyle.screen}>
      {/* Back button */}
      <View
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
            {
              padding: 6,
              borderRadius: 8,
              backgroundColor: "hsl(0, 0%, 95%)",
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <ChevronLeft size={24} color={theme.text} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover image */}
        {coverImage && (
          <Image
            source={{ uri: coverImage.url }}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH * 0.6,
              resizeMode: "cover",
              backgroundColor: theme.backgroundColorDark,
            }}
          />
        )}

        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
          {/* Category chip */}
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: theme.red + "18",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 4,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: theme.red,
                fontSize: 12,
                fontFamily: theme.fontBold,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {article.category}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 26,
              fontFamily: theme.fontBold,
              color: theme.sectionHeadingColor,
              lineHeight: 34,
              marginBottom: 8,
            }}
          >
            {article.title}
          </Text>

          {/* Date */}
          <Text
            style={{
              fontSize: 12,
              color: "hsl(0,0%,55%)",
              fontFamily: theme.font,
              marginBottom: 24,
            }}
          >
            {format(article.createdAt, "do MMMM yyyy")}
          </Text>

          {/* Divider */}
          <View
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
            <Text
              key={i}
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
            </Text>
          ))}

          {/* Extra images gallery */}
          {extraImages.length > 0 && (
            <View style={{ marginTop: 8 }}>
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
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
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
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
