import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  ChevronLeft,
  Lock,
  Unlock,
  ShoppingCart,
  LogIn,
  Play,
} from "lucide-react-native";
import WebView from "react-native-webview";
import { useQuery } from "@tanstack/react-query";
import { useCourseQuery } from "@/src/hooks/useCourseQuery";
import { useIsFocused  } from "expo-router";
import { StatusBar } from "expo-status-bar";
import JustifiedText from "@/src/components/JustifiedText";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useIsLoggedIn } from "@/src/hooks/useIsLoggedIn";
import { fetchMyCourses } from "@/src/api/fetchMyCourses";
import { queryKeys } from "@/src/lib/queryKeys";
import * as Linking from "expo-linking";

function getEmbedHtml(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?modestbranding=1&rel=0&controls=1&playsinline=1&origin=https://expressionsindia.app`;
    return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><style>*{margin:0;padding:0}html,body,iframe{width:100%;height:100%;border:0;background:#000}</style></head><body><iframe src="${embedUrl}" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture"></iframe></body></html>`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?playsinline=1`;
    return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><style>*{margin:0;padding:0}html,body,iframe{width:100%;height:100%;border:0;background:#000}</style></head><body><iframe src="${embedUrl}" allow="autoplay;fullscreen;picture-in-picture"></iframe></body></html>`;
  }

  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><style>*{margin:0;padding:0}html,body{width:100%;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%}</style></head><body><video src="${url}" controls playsinline></video></body></html>`;
}

export default function CourseOverview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const loggedIn = useIsLoggedIn();
  const {
    data: course,
    isLoading,
    error,
  } = useCourseQuery(id, { enabled: isFocused });

  // Check if the user is enrolled in this course.
  const { data: myCourses } = useQuery({
    queryKey: queryKeys.courses.my(),
    queryFn: fetchMyCourses,
    enabled: loggedIn === true && isFocused,
  });

  const isEnrolled = myCourses?.some((c) => c.id === id) ?? false;

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.red} />
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center", padding: 20 },
        ]}
      >
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          {error ? "Could not load course" : "Course not found"}
        </Text>
      </SafeAreaView>
    );
  }

  const firstChapter = course.chapters[0];
  const isFree = false; // For now, force users to enroll via the Buy button even if price is 0

  const handleStartDemo = () => {
    if (firstChapter) {
      router.push({
        pathname: "/course/[id]/chapter/[chapterId]",
        params: { id, chapterId: firstChapter.id },
      });
    }
  };

  const handleBuy = () => {
    router.push(`/course/${id}/buy`);
  };

  return (
    <SafeAreaView
      style={globalStyle.screen}
      edges={["left", "right", "bottom"]}
    >
      <StatusBar style="light" />
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 8,
          paddingTop: insets.top + 8,
          backgroundColor: theme.red,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { paddingVertical: 3, borderRadius: 8 },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={32} color="white" strokeWidth={1} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text
          style={[
            globalStyle.sectionHeading,
            { marginTop: 12, marginBottom: 16 },
          ]}
        >
          {course.title}
        </Text>

        {/* Introduction Video */}
        {course.introductionVideoUrl ? (
          <View
            style={{
              aspectRatio: 16 / 9,
              width: "100%",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 20,
              backgroundColor: "#000",
            }}
          >
            <WebView
              source={{
                html: getEmbedHtml(course.introductionVideoUrl),
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
              onShouldStartLoadWithRequest={(req) => {
                if (req.url.startsWith("https://www.youtube.com")) return true;
                if (req.url.startsWith("https://player.vimeo.com")) return true;
                if (req.url.startsWith("https://expressionsindia.app"))
                  return true;
                if (req.url === "about:blank") return true;
                return false;
              }}
            />
          </View>
        ) : null}

        {/* Description */}
        {course.description ? (
          <View style={{ marginBottom: 24 }}>
            <JustifiedText
              paragraphs={[course.description]}
              fontSize={15}
              lineHeight={23}
            />
          </View>
        ) : null}

        {/* Chapter List */}
        {course.chapters.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <Text
              style={{
                fontSize: 18,
                color: "#777",
                marginBottom: 12,
                fontFamily: theme.font,
              }}
            >
              Course Contents
            </Text>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.07)",
                overflow: "hidden",
                backgroundColor: "white",
              }}
            >
              {course.chapters.map((chapter, i) => (
                <View
                  key={chapter.id}
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 14,
                      paddingVertical: 13,
                      gap: 10,
                    },
                    i > 0 && {
                      borderTopWidth: 1,
                      borderTopColor: "rgba(0,0,0,0.06)",
                    },
                  ]}
                >
                  <Text
                    style={{
                      width: 22,
                      fontSize: 13,
                      color: "#aaa",
                      fontFamily: theme.font,
                    }}
                  >
                    {i + 1}.
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: theme.text,
                      fontFamily: theme.fontBold,
                    }}
                    numberOfLines={2}
                  >
                    {chapter.title}
                  </Text>
                  {chapter.isFree ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Unlock size={13} color="#16a34a" strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#16a34a",
                          fontFamily: theme.fontBold,
                        }}
                      >
                        Free
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Lock size={13} color="#aaa" strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#aaa",
                          fontFamily: theme.font,
                        }}
                      >
                        Paid
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom CTA Buttons */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 15,
          paddingTop: 12,
          paddingBottom: 12 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.07)",
          backgroundColor: "white",
        }}
      >
        {/* Start / Start Demo button — always shown if there's a first chapter */}
        <Pressable
          onPress={handleStartDemo}
          disabled={!firstChapter}
          style={({ pressed }) => [
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: theme.red,
              paddingVertical: 13,
              borderRadius: 10,
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            !firstChapter && { opacity: 0.5 },
          ]}
        >
          <Play size={18} color="white" strokeWidth={2} />
          <Text
            style={{ color: "white", fontFamily: theme.fontBold, fontSize: 15 }}
          >
            {isEnrolled || isFree ? "Start Learning" : "Preview"}
          </Text>
        </Pressable>

        {/* Second CTA — depends on login + enrollment state */}
        {loggedIn === false ? (
          // Not logged in → Login to Buy
          <Pressable
            onPress={() =>
              router.push({ pathname: "/login", params: { from: "course" } })
            }
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "white",
                paddingVertical: 13,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: theme.red,
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <LogIn size={20} color={theme.red} strokeWidth={2} />
            <Text
              style={{
                color: theme.red,
                fontFamily: theme.fontBold,
                fontSize: 15,
              }}
            >
              Login to Buy
            </Text>
          </Pressable>
        ) : isEnrolled || isFree ? (
          // Logged in + enrolled (or free course) → no buy button needed
          null
        ) : (
          // Logged in + NOT enrolled → Buy Course
          <Pressable
            onPress={handleBuy}
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "white",
                paddingVertical: 13,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: theme.red,
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <ShoppingCart size={20} color={theme.red} strokeWidth={2} />
            <Text
              style={{
                color: theme.red,
                fontFamily: theme.fontBold,
                fontSize: 15,
              }}
            >
              Buy — ₹{course.price ?? 0}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

