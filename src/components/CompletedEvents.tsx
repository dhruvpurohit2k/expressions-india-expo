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
import { theme } from "../theme";
import Pagination from "./Pagination";
import { usePastEventQuery } from "../hooks/usePastEventQuery";
import { useState } from "react";
import { useIsFocused  } from "expo-router";
import Animated, { FadeInUp, SlideInDown } from "react-native-reanimated";
import { format } from "date-fns";
import { safeDate } from "../lib/date";
import { tileColor } from "../utils/tileColor";

const LIMIT = 6;

function formatDateRange(startRaw: Date | null, endRaw: Date | null) {
  const startDate = safeDate(startRaw);
  const endDate = safeDate(endRaw);
  if (!startDate) return "Date TBA";
  const start = format(startDate, "do MMM - yy");
  if (!endDate) return start;
  return `${start} – ${format(endDate, "do MMM - yy")}`;
}

export default function CompletedEvents() {
  const [page, setPage] = useState(1);
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();

  const { data, isLoading } = usePastEventQuery({
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
    enabled: isFocused,
  });

  const events = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  return (
    <>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.red} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 12,
            paddingTop: 16,
            gap: 10,
          }}
          columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{ flex: 1 }}
              entering={SlideInDown.duration(500).delay(
                Math.min(index, 7) * 60,
              )}
            >
              <Link href={`/event/${item.id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View
                      style={[
                        {
                          backgroundColor: tileColor(item.id),
                          borderRadius: 5,
                          // elevation: 1,
                          borderWidth: 1,
                          borderColor: "hsl(0 0% 95%)",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.08,
                          shadowRadius: 6,
                          overflow: "hidden",
                        },
                        pressed && {
                          opacity: 0.88,
                          transform: [{ scale: 0.985 }],
                        },
                      ]}
                    >
                      {item.thumbnailUrl ? (
                        <Image
                          source={{ uri: item.thumbnailUrl }}
                          style={{ width: "100%", aspectRatio: 2 / 1 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ width: "100%", aspectRatio: 2 / 1 }} />
                      )}
                      <View style={{ padding: 8, gap: 6 }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 15,
                            fontFamily: theme.fontBold,
                            color: theme.text,
                            lineHeight: 17,
                          }}
                        >
                          {item.title}
                        </Text>
                        <View
                          style={{
                            // backgroundColor: "hsla(4, 84%, 42%, 0.1)",
                            paddingHorizontal: 6,
                            paddingVertical: 3,
                            borderRadius: 5,
                            alignSelf: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontFamily: theme.fontBold,
                              color: theme.red,
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
              style={[globalStyle.text, { textAlign: "center", marginTop: 60 }]}
            >
              No completed events.
            </Animated.Text>
          }
        />
      )}
      {totalPages > 0 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </>
  );
}
