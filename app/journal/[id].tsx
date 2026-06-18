import { useJournal } from "@/src/hooks/useJournal";
import { useIsFocused  } from "expo-router";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Download } from "lucide-react-native";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function toAbsoluteUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function JournalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { data: journal, isLoading, error } = useJournal(id, { enabled: isFocused });

  if (isLoading) {
    return (
      <SafeAreaView
        style={[globalStyle.screen, { alignItems: "center", justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" color={theme.red} />
        <Text style={globalStyle.text}>Loading journal...</Text>
      </SafeAreaView>
    );
  }

  if (error || !journal) {
    return (
      <SafeAreaView
        style={[globalStyle.screen, { alignItems: "center", justifyContent: "center", padding: 20 }]}
      >
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          {error ? "Could not load journal" : "Journal not found"}
        </Text>
        {error && (
          <Text style={[globalStyle.text, { textAlign: "center" }]}>
            {error instanceof Error ? error.message : "Unknown error"}
          </Text>
        )}
      </SafeAreaView>
    );
  }

  const coverUrl = toAbsoluteUrl(journal.media?.url);

  return (
    <SafeAreaView style={globalStyle.screen} edges={["left", "right", "bottom"]}>
      <View
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
            {
              padding: 6,
              borderRadius: 8,
            },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={24} color="white" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[globalStyle.sectionHeading, { marginTop: 0, marginBottom: 4 }]}
        >
          {journal.title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: theme.red,
            fontFamily: theme.fontBold,
            marginBottom: 16,
          }}
        >
          Vol. {journal.volume}, Issue {journal.issue} — {journal.startMonth}–
          {journal.endMonth} {journal.year}
        </Text>

        {journal.description && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, color: "#777", marginBottom: 8 }}>
              Description
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: theme.text,
                textAlign: "justify",
                lineHeight: 22,
              }}
            >
              {journal.description}
            </Text>
          </View>
        )}

        {coverUrl && (
          <Pressable
            onPress={() => Linking.openURL(coverUrl)}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                backgroundColor: theme.red,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                marginBottom: 20,
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Download size={18} color="white" strokeWidth={2} />
            <Text
              style={{
                color: "white",
                fontFamily: theme.fontBold,
                fontSize: 14,
                marginLeft: 8,
              }}
            >
              Download Journal
            </Text>
          </Pressable>
        )}

        {journal.chapters.length > 0 && (
          <View>
            <Text style={{ fontSize: 18, color: "#777", marginBottom: 12 }}>
              Chapters
            </Text>
            <View style={{ gap: 10 }}>
              {journal.chapters.map((chapter, index) => {
                const chapterPdfUrl = toAbsoluteUrl(chapter.media?.url);
                return (
                  <View
                    key={chapter.id}
                    style={{
                      backgroundColor: "hsl(0, 0%, 98%)",
                      borderRadius: 10,
                      padding: 14,
                      elevation: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fontBold,
                        fontSize: 15,
                        color: theme.text,
                        marginBottom: 4,
                      }}
                    >
                      {index + 1}. {chapter.title}
                    </Text>

                    {chapter.authors.length > 0 && (
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#777",
                          marginBottom: 4,
                        }}
                      >
                        {chapter.authors.map((a) => a.name).join(", ")}
                      </Text>
                    )}

                    {chapter.description && (
                      <Text
                        style={{
                          fontSize: 13,
                          color: theme.text,
                          lineHeight: 20,
                          marginBottom: 6,
                        }}
                      >
                        {chapter.description}
                      </Text>
                    )}

                    {chapterPdfUrl && (
                      <Pressable
                        onPress={() => Linking.openURL(chapterPdfUrl)}
                        style={({ pressed }) => [
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            alignSelf: "flex-start",
                            backgroundColor: theme.red,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            marginTop: 4,
                          },
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Download size={14} color="white" strokeWidth={2} />
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontFamily: theme.fontBold,
                            marginLeft: 6,
                          }}
                        >
                          Read Chapter
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
