import { useCallback, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { usePodcastQuery } from "@/src/hooks/usePodcastQuery";
import { useJournalQuery } from "@/src/hooks/useJournalQuery";
import { useArticleQuery } from "@/src/hooks/useArticleQuery";
import { NavBar } from "@/src/components/NavBar";
import Pagination from "@/src/components/Pagination";
import { PodcastCard } from "@/src/components/resources/PodcastCard";
import { JournalCard } from "@/src/components/resources/JournalCard";
import { ArticleCard } from "@/src/components/resources/ArticleCard";
import type { PodcastListItem } from "@/src/types/podcast";
import type { JournalListItem } from "@/src/types/journal";
import type { ArticleListItem } from "@/src/types/article";
import type { ListRenderItem } from "react-native";

type Tab = "podcasts" | "journals" | "articles";

const TABS: { key: Tab; label: string }[] = [
  { key: "podcasts", label: "Podcasts" },
  { key: "articles", label: "Articles" },
  { key: "journals", label: "Journals" },
];

const LIMIT = 8;

export default function Resources() {
  const [activeTab, setActiveTab] = useState<Tab>("podcasts");
  const [podcastPage, setPodcastPage] = useState(1);
  const [journalPage, setJournalPage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();

  const {
    data: podcastData,
    isLoading: podcastLoading,
    error: podcastError,
  } = usePodcastQuery({
    limit: LIMIT,
    offset: (podcastPage - 1) * LIMIT,
    enabled: isFocused,
  });

  const podcasts = podcastData?.data ?? [];
  const podcastTotalPages =
    podcastData?.meta?.totalPages ??
    Math.ceil((podcastData?.meta?.total ?? 0) / LIMIT);

  const {
    data: journalData,
    isLoading: journalLoading,
    error: journalError,
  } = useJournalQuery({
    limit: LIMIT,
    offset: (journalPage - 1) * LIMIT,
    enabled: isFocused,
  });

  const journals = journalData?.data ?? [];
  const journalTotalPages =
    journalData?.meta?.totalPages ??
    Math.ceil((journalData?.meta?.total ?? 0) / LIMIT);

  const {
    data: articleData,
    isLoading: articleLoading,
    error: articleError,
  } = useArticleQuery({
    limit: LIMIT,
    offset: (articlePage - 1) * LIMIT,
    enabled: isFocused,
  });

  const articles = articleData?.data ?? [];
  const articleTotalPages =
    articleData?.meta?.totalPages ??
    Math.ceil((articleData?.meta?.total ?? 0) / LIMIT);

  const renderPodcast: ListRenderItem<PodcastListItem> = useCallback(
    ({ item, index }) => <PodcastCard item={item} index={index} />,
    [],
  );

  const renderJournal: ListRenderItem<JournalListItem> = useCallback(
    ({ item, index }) => <JournalCard item={item} index={index} />,
    [],
  );

  const renderArticle: ListRenderItem<ArticleListItem> = useCallback(
    ({ item, index }) => <ArticleCard item={item} index={index} />,
    [],
  );

  return (
    <View style={globalStyle.screen}>
      <NavBar
        title="Resources"
        tabs={TABS}
        currentTab={activeTab}
        currentTabSetter={setActiveTab}
      />

      {activeTab === "podcasts" && (
        <>
          {podcastError && (
            <View style={{ paddingHorizontal: 15, paddingTop: 16 }}>
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
              contentContainerStyle={{
                paddingHorizontal: 10,
                gap: 10,
                paddingBottom: 12,
                paddingTop: 16,
              }}
              columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
              renderItem={renderPodcast}
              ListEmptyComponent={
                <Text
                  style={[
                    globalStyle.text,
                    { textAlign: "center", marginTop: 60 },
                  ]}
                >
                  No podcasts available.
                </Text>
              }
            />
          )}
          {podcastTotalPages > 0 && (
            <Pagination
              page={podcastPage}
              totalPages={podcastTotalPages}
              setPage={setPodcastPage}
            />
          )}
        </>
      )}

      {activeTab === "journals" && (
        <>
          {journalError && (
            <View style={{ paddingHorizontal: 15, paddingTop: 16 }}>
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
                paddingTop: 16,
                paddingHorizontal: 15,
                gap: 10,
                paddingBottom: 12,
              }}
              renderItem={renderJournal}
              ListEmptyComponent={
                <Text
                  style={[
                    globalStyle.text,
                    { textAlign: "center", marginTop: 60 },
                  ]}
                >
                  No journals available.
                </Text>
              }
            />
          )}
          {journalTotalPages > 0 && (
            <Pagination
              page={journalPage}
              totalPages={journalTotalPages}
              setPage={setJournalPage}
            />
          )}
        </>
      )}

      {activeTab === "articles" && (
        <>
          {articleError && (
            <View style={{ paddingHorizontal: 15, paddingTop: 16 }}>
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
              contentContainerStyle={{
                paddingHorizontal: 10,
                gap: 10,
                paddingBottom: 12,
                paddingTop: 16,
              }}
              columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
              renderItem={renderArticle}
              ListEmptyComponent={
                <Text
                  style={[
                    globalStyle.text,
                    { textAlign: "center", marginTop: 60 },
                  ]}
                >
                  No articles available.
                </Text>
              }
            />
          )}
          {articleTotalPages > 0 && (
            <Pagination
              page={articlePage}
              totalPages={articleTotalPages}
              setPage={setArticlePage}
            />
          )}
        </>
      )}
    </View>
  );
}
