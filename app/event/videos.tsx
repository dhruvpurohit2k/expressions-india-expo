import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i,
  );
  return match?.[1] ?? null;
}

export default function Videos() {
  const { urls } = useLocalSearchParams<{ urls: string }>();
  let links: string[] = [];
  try {
    links = urls ? JSON.parse(urls) : [];
  } catch (e) {
    console.error("Failed to parse videos:", e);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}
    >
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
        <Text
          style={{
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.sectionHeadingColor,
            marginLeft: 10,
          }}
        >
          Videos
        </Text>
      </View>

      {links.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: theme.text }}>No videos.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 40,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {links.map((url, i) => {
            const videoId = extractYouTubeId(url);
            if (!videoId) return null;
            const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&origin=https://expressionsindia.app`;
            return (
              <View
                key={i}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              >
                <View
                  style={{
                    width: SCREEN_WIDTH - 30,
                    aspectRatio: 16 / 9,
                  }}
                >
                  <WebView
                    source={{
                      html: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<style>*{margin:0;padding:0}html,body,iframe{width:100%;height:100%;border:0;background:#000}</style>
</head><body>
<iframe src="${embedUrl}" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>
</body></html>`,
                      baseUrl: "https://expressionsindia.app",
                    }}
                    style={{ flex: 1 }}
                    originWhitelist={["*"]}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    scrollEnabled={false}
                    onShouldStartLoadWithRequest={(request) => {
                      if (request.url.startsWith("https://www.youtube.com"))
                        return true;
                      if (
                        request.url.startsWith("https://expressionsindia.app")
                      )
                        return true;
                      if (request.url === "about:blank") return true;
                      return false;
                    }}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
