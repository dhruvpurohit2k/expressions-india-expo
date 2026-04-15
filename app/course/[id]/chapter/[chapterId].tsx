import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  Unlock,
} from "lucide-react-native";
import WebView from "react-native-webview";
import { useCourseQuery } from "@/src/hooks/useCourseQuery";
import { useChapterQuery } from "@/src/hooks/useChapterQuery";
import { AccessError } from "@/src/api/fetchChapter";
import { useIsFocused } from "@react-navigation/native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";

export default function ChapterView() {
  const { id, chapterId } = useLocalSearchParams<{ id: string; chapterId: string }>();
  const globalStyle = styleFactory();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isFocused = useIsFocused();
  const { data: course, isLoading: courseLoading, error: courseError } = useCourseQuery(id, { enabled: isFocused });
  const { data: chapter, isLoading: chapterLoading, error: chapterError } = useChapterQuery(id, chapterId, { enabled: isFocused });

  // 401 — not logged in
  if (chapterError instanceof AccessError && chapterError.status === 401) {
    return (
      <SafeAreaView style={[globalStyle.screen, { alignItems: "center", justifyContent: "center", padding: 32 }]}>
        <Lock size={48} color="#ccc" strokeWidth={1.5} style={{ marginBottom: 20 }} />
        <Text style={{ fontFamily: theme.fontBold, fontSize: 20, color: theme.sectionHeadingColor, textAlign: "center", marginBottom: 10 }}>
          Login required
        </Text>
        <Text style={{ fontFamily: theme.font, fontSize: 14, color: theme.text, opacity: 0.65, textAlign: "center", lineHeight: 21, marginBottom: 28 }}>
          Please sign in to access this chapter.
        </Text>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/login",
              params: { redirectCourseId: id, redirectChapterId: chapterId },
            })
          }
          style={({ pressed }) => [
            {
              backgroundColor: theme.red,
              paddingHorizontal: 28,
              paddingVertical: 13,
              borderRadius: 8,
            },
            pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
          ]}
        >
          <Text style={{ fontFamily: theme.fontBold, fontSize: 15, color: "white", letterSpacing: 0.3 }}>
            Sign in to continue
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // 403 — logged in but not enrolled
  if (chapterError instanceof AccessError && chapterError.status === 403) {
    return (
      <SafeAreaView style={[globalStyle.screen, { alignItems: "center", justifyContent: "center", padding: 32 }]}>
        <Lock size={48} color="#ccc" strokeWidth={1.5} style={{ marginBottom: 20 }} />
        <Text style={{ fontFamily: theme.fontBold, fontSize: 20, color: theme.sectionHeadingColor, textAlign: "center", marginBottom: 10 }}>
          Chapter locked
        </Text>
        <Text style={{ fontFamily: theme.font, fontSize: 14, color: theme.text, opacity: 0.65, textAlign: "center", lineHeight: 21, marginBottom: 28 }}>
          Purchase this course to unlock all chapters.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            {
              borderWidth: 1.5,
              borderColor: theme.red,
              paddingHorizontal: 28,
              paddingVertical: 13,
              borderRadius: 8,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={{ fontFamily: theme.fontBold, fontSize: 15, color: theme.red, letterSpacing: 0.3 }}>
            View course
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (courseLoading || chapterLoading) {
    return (
      <SafeAreaView
        style={[globalStyle.screen, { alignItems: "center", justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" color={theme.red} />
      </SafeAreaView>
    );
  }

  if (courseError || chapterError || !course || !chapter) {
    return (
      <SafeAreaView
        style={[globalStyle.screen, { alignItems: "center", justifyContent: "center", padding: 20 }]}
      >
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          {courseError || chapterError ? "Could not load chapter" : "Chapter not found"}
        </Text>
      </SafeAreaView>
    );
  }

  const chapters = course.chapters;
  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const goToChapter = (cId: string) => {
    setDrawerOpen(false);
    router.replace({ pathname: "/course/[id]/chapter/[chapterId]", params: { id, chapterId: cId } });
  };

  return (
    <SafeAreaView style={[globalStyle.screen, { flex: 1 }]} edges={["top"]}>
      {/* Chapter Drawer */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          {/* Drawer Panel */}
          <View
            style={{
              width: "78%",
              maxWidth: 320,
              backgroundColor: "white",
              height: "100%",
              elevation: 16,
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 0 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
            }}
          >
            {/* Drawer Header */}
            <SafeAreaView edges={["top"]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(0,0,0,0.07)",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontFamily: theme.fontBold,
                    color: theme.text,
                  }}
                  numberOfLines={1}
                >
                  {course.title}
                </Text>
                <Pressable
                  onPress={() => setDrawerOpen(false)}
                  style={({ pressed }) => [
                    { padding: 6, borderRadius: 6 },
                    pressed && { backgroundColor: "hsl(0,0%,95%)" },
                  ]}
                >
                  <X size={20} color={theme.text} strokeWidth={2} />
                </Pressable>
              </View>
            </SafeAreaView>

            {/* Chapter List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {chapters.map((c, i) => {
                const isActive = c.id === chapterId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => goToChapter(c.id)}
                    activeOpacity={0.7}
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                      },
                      isActive && { backgroundColor: theme.red + "10" },
                      i > 0 && {
                        borderTopWidth: 1,
                        borderTopColor: "rgba(0,0,0,0.05)",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        width: 20,
                        fontSize: 12,
                        marginTop: 1,
                        color: isActive ? theme.red : "#aaa",
                        fontFamily: theme.font,
                      }}
                    >
                      {i + 1}.
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontFamily: isActive ? theme.fontBold : theme.font,
                        color: isActive ? theme.red : theme.text,
                        lineHeight: 19,
                      }}
                    >
                      {c.title}
                    </Text>
                    {c.isFree ? (
                      <Unlock size={13} color="#16a34a" strokeWidth={2} style={{ marginTop: 2 }} />
                    ) : (
                      <Lock size={13} color="#bbb" strokeWidth={2} style={{ marginTop: 2 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Backdrop — tap to close */}
          <Pressable
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>

      {/* Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.07)",
          backgroundColor: "white",
          gap: 8,
        }}
      >
        <Pressable
          onPress={() => setDrawerOpen(true)}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 8 },
            pressed && { backgroundColor: "hsl(0,0%,93%)" },
          ]}
        >
          <Menu size={22} color={theme.text} strokeWidth={2} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: theme.fontBold,
              color: theme.text,
            }}
          >
            Chapter {currentIndex + 1}
          </Text>
        </Pressable>

        <Text
          style={{
            flex: 1,
            fontSize: 13,
            color: "#aaa",
            fontFamily: theme.font,
            textAlign: "right",
          }}
        >
          {currentIndex + 1} / {chapters.length}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter Title */}
        <Text style={[globalStyle.sectionHeading, { marginBottom: 16 }]}>
          {chapter.title}
        </Text>

        {/* Video */}
        {chapter.videoLinkUrl ? (
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
                html: getEmbedHtml(chapter.videoLinkUrl),
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
                if (req.url.startsWith("https://expressionsindia.app")) return true;
                if (req.url === "about:blank") return true;
                return false;
              }}
            />
          </View>
        ) : null}

        {/* Description */}
        {chapter.description ? (
          <Text
            style={{
              fontSize: 15,
              color: theme.text,
              lineHeight: 23,
              marginBottom: 24,
              textAlign: "justify",
            }}
          >
            {chapter.description}
          </Text>
        ) : null}

        {/* Downloadable Content */}
        {chapter.downloadableContent.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <Text
              style={{
                fontSize: 15,
                color: "#777",
                fontFamily: theme.font,
                marginBottom: 10,
              }}
            >
              Downloads
            </Text>
            <View style={{ gap: 8 }}>
              {chapter.downloadableContent.map((file) => (
                <Pressable
                  key={file.id}
                  onPress={() => Linking.openURL(file.url)}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "white",
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: "rgba(0,0,0,0.08)",
                      elevation: 1,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 3,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Download size={18} color={theme.red} strokeWidth={2} />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: theme.text,
                      fontFamily: theme.fontBold,
                    }}
                    numberOfLines={2}
                  >
                    {file.name || file.url}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Sticky Bottom Prev/Next Navigation */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.07)",
          backgroundColor: "white",
        }}
      >
        <Pressable
          onPress={() => prevChapter && goToChapter(prevChapter.id)}
          disabled={!prevChapter}
          style={({ pressed }) => [
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 11,
              paddingHorizontal: 12,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: prevChapter ? theme.red : "rgba(0,0,0,0.12)",
              backgroundColor: "white",
            },
            pressed && prevChapter && { opacity: 0.8 },
            !prevChapter && { opacity: 0.4 },
          ]}
        >
          <ChevronLeft size={16} color={prevChapter ? theme.red : "#bbb"} strokeWidth={2.5} />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontFamily: theme.fontBold,
              color: prevChapter ? theme.red : "#bbb",
            }}
            numberOfLines={1}
          >
            {prevChapter ? prevChapter.title : "Previous"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => nextChapter && goToChapter(nextChapter.id)}
          disabled={!nextChapter}
          style={({ pressed }) => [
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 6,
              paddingVertical: 11,
              paddingHorizontal: 12,
              borderRadius: 10,
              backgroundColor: nextChapter ? theme.red : "rgba(0,0,0,0.06)",
            },
            pressed && nextChapter && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            !nextChapter && { opacity: 0.4 },
          ]}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontFamily: theme.fontBold,
              color: "white",
              textAlign: "right",
            }}
            numberOfLines={1}
          >
            {nextChapter ? nextChapter.title : "Next"}
          </Text>
          <ChevronRight size={16} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
