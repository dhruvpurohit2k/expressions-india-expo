import { usePodcast } from "@/src/hooks/usePodcast";
import { useIsFocused  } from "expo-router";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

function getYouTubeEmbedUrl(link: string): string | null {
  let videoId: string | null = null;
  try {
    const url = new URL(link);
    if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v");
    } else if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    }
  } catch {
    return null;
  }
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=0&iv_load_policy=3&playsinline=0&fs=1`;
}

export default function PodcastDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { data: podcast, isLoading, error } = usePodcast(id, { enabled: isFocused });

  if (isLoading) {
    return (
      <SafeAreaView style={[globalStyle.screen, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.red} />
        <Text style={globalStyle.text}>Loading podcast...</Text>
      </SafeAreaView>
    );
  }

  if (error || !podcast) {
    return (
      <SafeAreaView style={[globalStyle.screen, { alignItems: "center", justifyContent: "center", padding: 20 }]}>
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          {error ? "Could not load podcast" : "Podcast not found"}
        </Text>
        {error && (
          <Text style={[globalStyle.text, { textAlign: "center" }]}>
            {error instanceof Error ? error.message : "Unknown error"}
          </Text>
        )}
      </SafeAreaView>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(podcast.link);
  const tags: string[] = podcast.tags
    ? podcast.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <SafeAreaView style={globalStyle.screen} edges={["left", "right", "bottom"]}>
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
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text
          entering={FadeInDown.duration(400).delay(80)}
          style={[globalStyle.sectionHeading, { marginTop: 0, marginBottom: 12 }]}
        >
          {podcast.title}
        </Animated.Text>

        {embedUrl && (
          <Animated.View
            entering={FadeInUp.duration(450).delay(160)}
            style={{
              aspectRatio: 16 / 9,
              width: "100%",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 16,
              backgroundColor: "#000",
            }}
          >
            <WebView
              source={{
                html: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<style>*{margin:0;padding:0}html,body,iframe{width:100%;height:100%;border:0;background:#000}</style>
</head><body>
<iframe src="${embedUrl}&origin=https://expressionsindia.app"
  allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;fullscreen"
  allowfullscreen></iframe>
</body></html>`,
                baseUrl: "https://expressionsindia.app",
              }}
              style={{ flex: 1 }}
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
              scrollEnabled={false}
              setSupportMultipleWindows={false}
              onShouldStartLoadWithRequest={(request) => {
                if (request.url.startsWith("https://www.youtube.com")) return true;
                if (request.url.startsWith("https://expressionsindia.app")) return true;
                if (request.url === "about:blank") return true;
                return false;
              }}
            />
          </Animated.View>
        )}

        {tags.length > 0 && (
          <Animated.View entering={FadeInUp.duration(400).delay(220)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, color: "#777", marginBottom: 8 }}>Tags</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: theme.red,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 13, fontFamily: theme.fontBold }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {podcast.description && (
          <Animated.View entering={FadeInUp.duration(400).delay(280)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, color: "#777", marginBottom: 8 }}>Description</Text>
            <Text style={{ fontSize: 15, color: theme.text, textAlign: "justify", lineHeight: 22 }}>
              {podcast.description}
            </Text>
          </Animated.View>
        )}

        {!!podcast.transcript && (
          <Animated.View entering={FadeInUp.duration(400).delay(340)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, color: "#777", marginBottom: 8 }}>Transcript</Text>
            <Text style={{ fontSize: 14, color: theme.text, lineHeight: 22 }}>
              {podcast.transcript}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
