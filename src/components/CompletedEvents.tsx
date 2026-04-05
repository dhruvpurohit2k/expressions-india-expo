import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { styleFactory } from "../styleFactory";
import { Link } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { theme } from "../theme";
import { usePastEventQuery } from "../hooks/usePastEventQuery";
import { useState } from "react";
import Animated, { FadeInUp, SlideInDown } from "react-native-reanimated";

const LIMIT = 10;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
];

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateRange(startDate: Date, endDate: Date | null) {
  if (!endDate) return formatDate(startDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export default function CompletedEvents() {
  const [page, setPage] = useState(1);
  const globalStyle = styleFactory();

  const { data, isLoading, error } = usePastEventQuery({
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
  });

  const events = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  return (
    <>
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
          contentContainerStyle={{
            paddingHorizontal: 15,
            gap: 16,
            paddingBottom: 12,
            marginTop: 16,
          }}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInDown.duration(500).delay(Math.min(index, 7) * 80)}>
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

                      {/* Completed badge */}
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
                            fontSize: 15,
                            fontFamily: theme.fontBold,
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
                          <Text
                            style={{
                              fontSize: 11,
                              fontFamily: theme.fontBold,
                              color: theme.sectionHeadingColor,
                            }}
                          >
                            {formatDateRange(item.startDate, item.endDate)}
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
            <Animated.Text
              entering={FadeInUp.duration(400).delay(200)}
              style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}
            >
              No completed events.
            </Animated.Text>
          }
        />
      )}

      <Animated.View
        entering={FadeInUp.duration(350).delay(100)}
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
      </Animated.View>
    </>
  );
}
