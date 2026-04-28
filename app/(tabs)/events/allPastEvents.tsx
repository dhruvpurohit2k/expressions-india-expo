import { usePastEventQuery } from "@/src/hooks/usePastEventQuery";
import { useIsFocused } from "@react-navigation/native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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
import { Link } from "expo-router";
import { safeDate } from "@/src/lib/date";

const LIMIT = 10;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
];

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateRange(startRaw: Date | null, endRaw: Date | null) {
  const startDate = safeDate(startRaw);
  const endDate = safeDate(endRaw);
  if (!startDate) return "Date TBA";
  if (!endDate) return formatDate(startDate);
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

export default function AllPastEvents() {
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const globalStyle = styleFactory();

  const { data, isLoading, error } = usePastEventQuery({
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
    enabled: isFocused,
  });

  const events = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  return (
    <SafeAreaView style={globalStyle.screen} edges={["top"]}>
      <Text style={[globalStyle.sectionHeading, { marginHorizontal: 15 }]}>
        Past Events
      </Text>

      {error && (
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={{ color: theme.red }}>
            Could not load events. Please try again.
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.red} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 15, gap: 16, paddingBottom: 12, marginTop: 8 }}
          renderItem={({ item }) => (
            <Link href={`/event/${item.id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <View
                    style={[
                      {
                        backgroundColor: "hsl(0, 0%, 100%)",
                        borderRadius: 12,
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 6,
                        overflow: "hidden",
                      },
                      pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
                    ]}
                  >
                    {item.thumbnailUrl ? (
                      <Image
                        source={{ uri: item.thumbnailUrl }}
                        style={{ width: "100%", aspectRatio: 16 / 9 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: "100%",
                          aspectRatio: 16 / 9,
                          backgroundColor: "hsl(0, 0%, 85%)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 36, opacity: 0.4 }}>📷</Text>
                      </View>
                    )}
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 10, fontFamily: theme.fontBold }}>
                        COMPLETED
                      </Text>
                    </View>
                    <View style={{ padding: 12 }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          fontFamily: theme.fontBold,
                          fontSize: 15,
                          color: theme.text,
                          marginBottom: 6,
                          lineHeight: 21,
                        }}
                      >
                        {item.title}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "hsla(4, 84%, 42%, 0.1)",
                          alignSelf: "flex-start",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontFamily: theme.fontBold, color: theme.sectionHeadingColor }}>
                          {formatDateRange(item.startDate, item.endDate)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <Text style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}>
              No past events.
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
          onPress={() => setPage((p) => p - 1)}
          disabled={page === 1}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.red,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
              opacity: page === 1 ? 0.35 : 1,
            },
            pressed && { opacity: 0.75 },
          ]}
        >
          <ChevronLeft size={18} color="white" strokeWidth={2.5} />
          <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14, marginLeft: 2 }}>
            Prev
          </Text>
        </Pressable>

        <Text style={{ color: theme.text, fontFamily: theme.font, fontSize: 14 }}>
          {totalPages > 0 ? `${page} / ${totalPages}` : "—"}
        </Text>

        <Pressable
          onPress={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.red,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
              opacity: page >= totalPages ? 0.35 : 1,
            },
            pressed && { opacity: 0.75 },
          ]}
        >
          <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14, marginRight: 2 }}>
            Next
          </Text>
          <ChevronRight size={18} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
