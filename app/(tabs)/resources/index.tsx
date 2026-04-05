import Animated, { SlideInDown } from "react-native-reanimated";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { usePodcastQuery } from "@/src/hooks/usePodcastQuery";
import { useJournalQuery } from "@/src/hooks/useJournalQuery";
import { useArticleQuery } from "@/src/hooks/useArticleQuery";
import { Link } from "expo-router";
import { format } from "date-fns";
import { NavBar } from "@/src/components/NavBar";
import Pagination from "@/src/components/Pagination";
import { Mic } from "lucide-react-native";

type Tab = "podcasts" | "journals" | "articles";

const TABS: { key: Tab; label: string }[] = [
  { key: "podcasts", label: "Podcasts" },
  { key: "journals", label: "Journals" },
  { key: "articles", label: "Articles" },
];

const LIMIT = 8;

function formatDate(date: Date) {
  return format(date, "do MMM - yy");
}


export default function Resources() {
  const [activeTab, setActiveTab] = useState<Tab>("podcasts");
  const [podcastPage, setPodcastPage] = useState(1);
  const [journalPage, setJournalPage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);
  const globalStyle = styleFactory();

  const {
    data: podcastData,
    isLoading: podcastLoading,
    error: podcastError,
  } = usePodcastQuery({
    limit: LIMIT,
    offset: (podcastPage - 1) * LIMIT,
  });

  const podcasts = podcastData?.data ?? [];
  const podcastTotal = podcastData?.meta?.total ?? 0;
  const podcastTotalPages =
    podcastData?.meta?.totalPages ?? Math.ceil(podcastTotal / LIMIT);

  const {
    data: journalData,
    isLoading: journalLoading,
    error: journalError,
  } = useJournalQuery({
    limit: LIMIT,
    offset: (journalPage - 1) * LIMIT,
  });

  const journals = journalData?.data ?? [];
  const journalTotal = journalData?.meta?.total ?? 0;
  const journalTotalPages =
    journalData?.meta?.totalPages ?? Math.ceil(journalTotal / LIMIT);

  const {
    data: articleData,
    isLoading: articleLoading,
    error: articleError,
  } = useArticleQuery({
    limit: LIMIT,
    offset: (articlePage - 1) * LIMIT,
  });

  const articles = articleData?.data ?? [];
  const articleTotal = articleData?.meta?.total ?? 0;
  const articleTotalPages =
    articleData?.meta?.totalPages ?? Math.ceil(articleTotal / LIMIT);

  return (
    <SafeAreaView style={globalStyle.screen} edges={["top"]}>
      <NavBar
        title="Resources"
        tabs={TABS}
        currentTab={activeTab}
        currentTabSetter={setActiveTab}
      />
      {activeTab === "podcasts" && (
        <>
          {podcastError && (
            <View style={{ paddingHorizontal: 15 }}>
              <Text style={{ color: theme.red }}>
                Could not load podcasts. Please try again.
              </Text>
            </View>
          )}

          {podcastLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={theme.red} />
            </View>
          ) : (
            <FlatList
              data={podcasts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 10, gap: 10, paddingBottom: 12, marginTop: 8 }}
              columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
              renderItem={({ item, index }) => (
                <Animated.View
                  style={{ flex: 1 }}
                  entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 60)}
                >
                  <Link href={`/podcast/${item.id}`} asChild>
                    <Pressable style={{ flex: 1 }}>
                      {({ pressed }) => (
                        <View
                          style={[
                            {
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: 12,
                              elevation: 1,
                              overflow: "hidden",
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.06,
                              shadowRadius: 4,
                            },
                            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                          ]}
                        >
                          <View
                            style={{
                              width: "100%",
                              aspectRatio: 1,
                              backgroundColor: theme.red + "12",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Mic size={36} color={theme.red} strokeWidth={1.5} />
                          </View>
                          <View style={{ padding: 8, gap: 6 }}>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={{
                                fontSize: 12,
                                fontFamily: theme.fontBold,
                                color: theme.text,
                                lineHeight: 17,
                              }}
                            >
                              {item.title}
                            </Text>
                            <View
                              style={{
                                backgroundColor: theme.red + "12",
                                alignSelf: "flex-start",
                                paddingHorizontal: 6,
                                paddingVertical: 3,
                                borderRadius: 5,
                              }}
                            >
                              <Text style={{ fontSize: 10, fontFamily: theme.fontBold, color: theme.red }}>
                                {formatDate(item.createdAt)}
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
                <Text style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}>
                  No podcasts available.
                </Text>
              }
            />
          )}

          <Pagination
            page={podcastPage}
            totalPages={podcastTotalPages}
            setPage={setPodcastPage}
          />
        </>
      )}

      {activeTab === "journals" && (
        <>
          {journalError && (
            <View style={{ paddingHorizontal: 15 }}>
              <Text style={{ color: theme.red }}>
                Could not load journals. Please try again.
              </Text>
            </View>
          )}

          {journalLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={theme.red} />
            </View>
          ) : (
            <FlatList
              data={journals}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 15,
                gap: 8,
                paddingBottom: 12,
              }}
              renderItem={({ item, index }) => (
                <Animated.View
                  entering={SlideInDown.duration(450).delay(
                    Math.min(index, 8) * 60,
                  )}
                >
                  <Link href={`/journal/${item.id}`} asChild>
                    <Pressable>
                      {({ pressed }) => (
                        <View
                          style={[
                            {
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: 5,
                              elevation: 1,
                              padding: 12,
                            },
                            pressed && {
                              opacity: 0.85,
                              transform: [{ scale: 0.99 }],
                            },
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 15,
                              color: "hsl(0, 0%, 30%)",
                              marginBottom: 6,
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "bold",
                              color: "hsl(0, 120%, 50%)",
                              textAlign: "right",
                            }}
                          >
                            {item.startMonth}–{item.endMonth} {item.year}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </Link>
                </Animated.View>
              )}
              ListEmptyComponent={
                <Text
                  style={[
                    globalStyle.text,
                    { textAlign: "center", marginTop: 40 },
                  ]}
                >
                  No journals available.
                </Text>
              }
            />
          )}
          <Pagination
            page={journalPage}
            totalPages={journalTotalPages}
            setPage={setJournalPage}
          />
          {/*<View
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
              onPress={() => setJournalPage((p) => p - 1)}
              disabled={journalPage === 1}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.red,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  opacity: journalPage === 1 ? 0.35 : 1,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <ChevronLeft size={18} color="white" strokeWidth={2.5} />
              <Text
                style={{
                  color: "white",
                  fontFamily: theme.fontBold,
                  fontSize: 14,
                  marginLeft: 2,
                }}
              >
                Prev
              </Text>
            </Pressable>

            <Text
              style={{
                color: theme.text,
                fontFamily: theme.font,
                fontSize: 14,
              }}
            >
              {journalTotalPages > 0
                ? `${journalPage} / ${journalTotalPages}`
                : "—"}
            </Text>

            <Pressable
              onPress={() => setJournalPage((p) => p + 1)}
              disabled={journalPage >= journalTotalPages}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.red,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  opacity: journalPage >= journalTotalPages ? 0.35 : 1,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: theme.fontBold,
                  fontSize: 14,
                  marginRight: 2,
                }}
              >
                Next
              </Text>
              <ChevronRight size={18} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>*/}
        </>
      )}
      {activeTab === "articles" && (
        <>
          {articleError && (
            <View style={{ paddingHorizontal: 15 }}>
              <Text style={{ color: theme.red }}>
                Could not load articles. Please try again.
              </Text>
            </View>
          )}

          {articleLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={theme.red} />
            </View>
          ) : (
            <FlatList
              data={articles}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 10, gap: 10, paddingBottom: 12, marginTop: 8 }}
              columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
              renderItem={({ item, index }) => (
                <Animated.View
                  style={{ flex: 1 }}
                  entering={SlideInDown.duration(450).delay(Math.min(index, 8) * 60)}
                >
                  <Link href={`/article/${item.id}`} asChild>
                    <Pressable style={{ flex: 1 }}>
                      {({ pressed }) => (
                        <View
                          style={[
                            {
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: 12,
                              elevation: 1,
                              overflow: "hidden",
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.06,
                              shadowRadius: 4,
                            },
                            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                          ]}
                        >
                          {item.thumbnailUrl ? (
                            <Image
                              source={{ uri: item.thumbnailUrl }}
                              style={{ width: "100%", aspectRatio: 1 }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View
                              style={{
                                width: "100%",
                                aspectRatio: 1,
                                backgroundColor: theme.backgroundColorDark,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={{ fontSize: 28 }}>📄</Text>
                            </View>
                          )}
                          <View style={{ padding: 8, gap: 6 }}>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={{
                                fontSize: 12,
                                fontFamily: theme.fontBold,
                                color: theme.text,
                                lineHeight: 17,
                              }}
                            >
                              {item.title}
                            </Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                              <View
                                style={{
                                  backgroundColor: theme.red + "18",
                                  borderRadius: 5,
                                  paddingHorizontal: 6,
                                  paddingVertical: 3,
                                }}
                              >
                                <Text style={{ fontSize: 10, color: theme.red, fontFamily: theme.fontBold }}>
                                  {item.category}
                                </Text>
                              </View>
                              <View
                                style={{
                                  backgroundColor: theme.backgroundColorDark,
                                  borderRadius: 5,
                                  paddingHorizontal: 6,
                                  paddingVertical: 3,
                                }}
                              >
                                <Text style={{ fontSize: 10, color: "hsl(0,0%,45%)", fontFamily: theme.font }}>
                                  {formatDate(item.createdAt)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </Pressable>
                  </Link>
                </Animated.View>
              )}
              ListEmptyComponent={
                <Text style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}>
                  No articles available.
                </Text>
              }
            />
          )}

          <Pagination
            page={articlePage}
            totalPages={articleTotalPages}
            setPage={setArticlePage}
          />
        </>
      )}
    </SafeAreaView>
  );
}
