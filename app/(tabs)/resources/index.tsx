import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { usePodcastQuery } from "@/src/hooks/usePodcastQuery";
import { useJournalQuery } from "@/src/hooks/useJournalQuery";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Link } from "expo-router";
import { format } from "date-fns";

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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<Tab>("podcasts");
  const [podcastPage, setPodcastPage] = useState(1);
  const [journalPage, setJournalPage] = useState(1);
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

  return (
    <SafeAreaView style={globalStyle.screen}>
      <Text style={[globalStyle.sectionHeading, { marginHorizontal: 15 }]}>
        Resources
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          marginVertical: 10,
          borderRadius: 10,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.red,
        }}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              backgroundColor:
                activeTab === tab.key ? theme.red : "transparent",
            }}
          >
            <Text
              style={{
                color: activeTab === tab.key ? "white" : theme.red,
                fontFamily: theme.fontBold,
                fontSize: 14,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

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
              contentContainerStyle={{
                paddingHorizontal: 15,
                gap: 8,
                paddingBottom: 12,
              }}
              renderItem={({ item }) => (
                <Link href={`/podcast/${item.id}`} asChild>
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
                          {formatDate(item.createdAt)}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </Link>
              )}
              ListEmptyComponent={
                <Text
                  style={[
                    globalStyle.text,
                    { textAlign: "center", marginTop: 40 },
                  ]}
                >
                  No podcasts available.
                </Text>
              }
            />
          )}

          <View
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
              onPress={() => setPodcastPage((p) => p - 1)}
              disabled={podcastPage === 1}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.red,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  opacity: podcastPage === 1 ? 0.35 : 1,
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
              {podcastTotalPages > 0
                ? `${podcastPage} / ${podcastTotalPages}`
                : "—"}
            </Text>

            <Pressable
              onPress={() => setPodcastPage((p) => p + 1)}
              disabled={podcastPage >= podcastTotalPages}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.red,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  opacity: podcastPage >= podcastTotalPages ? 0.35 : 1,
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
          </View>
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
              renderItem={({ item }) => (
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

          <View
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
          </View>
        </>
      )}
      {activeTab === "articles" && (
        <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 10 }}>
          <Text style={globalStyle.text}>Articles coming soon.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
