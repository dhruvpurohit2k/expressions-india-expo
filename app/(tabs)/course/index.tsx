import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react-native";
import { NavBar } from "@/src/components/NavBar";
import Pagination from "@/src/components/Pagination";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useCourseListQuery } from "@/src/hooks/useCourseListQuery";
import { useIsFocused } from "@react-navigation/native";
import { CourseCard } from "@/src/components/course/CourseCard";
import { AUDIENCE_LABELS } from "@/src/types/audience";
import type { CourseListItem } from "@/src/types/course";
import type { ListRenderItem } from "react-native";

type Tab = "browse" | "applied";
type SortField = "createdAt" | "updatedAt";
type SortDir = "asc" | "desc";

const TABS: { key: Tab; label: string }[] = [
  { key: "browse", label: "Browse" },
  { key: "applied", label: "Applied" },
];

const AUDIENCES = Object.entries(AUDIENCE_LABELS) as [string, string][];
const PAGE_SIZE = 12;

export default function CourseIndex() {
  const globalStyle = styleFactory();
  const [currentTab, setCurrentTab] = useState<Tab>("browse");
  const [search, setSearch] = useState("");
  const [selectedAudiences, setSelectedAudiences] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const isFocused = useIsFocused();

  const { data, isLoading, error } = useCourseListQuery({
    enabled: isFocused,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    search: search.trim() || undefined,
    audiences: selectedAudiences.size > 0 ? [...selectedAudiences].join(",") : undefined,
    sortField,
    sortOrder: sortDir,
  });

  const courses = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE);

  const toggleAudience = useCallback((key: string) => {
    setSelectedAudiences((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setPage(1);
  }, []);

  const renderCourse: ListRenderItem<CourseListItem> = useCallback(
    ({ item, index }) => <CourseCard item={item} index={index} />,
    [],
  );

  return (
    <SafeAreaView style={globalStyle.screen} edges={["top"]}>
      <NavBar
        title="Courses"
        tabs={TABS}
        currentTab={currentTab}
        currentTabSetter={setCurrentTab}
      />

      {currentTab === "browse" && (
        <>
          {/* Search bar */}
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                paddingHorizontal: 10,
                height: 40,
                gap: 6,
              }}
            >
              <Search size={16} color="#aaa" strokeWidth={2} />
              <TextInput
                value={search}
                onChangeText={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                placeholder="Search courses..."
                placeholderTextColor="#bbb"
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: theme.text,
                  fontFamily: theme.font,
                  paddingVertical: 0,
                }}
              />
              {search.length > 0 && (
                <Pressable onPress={() => { setSearch(""); setPage(1); }} hitSlop={8}>
                  <X size={14} color="#aaa" strokeWidth={2.5} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Audience filter chips + sort controls */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 8 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 12,
                paddingRight: 6,
                gap: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {AUDIENCES.map(([key, label]) => {
                const active = selectedAudiences.has(key);
                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleAudience(key)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: active ? theme.red : "rgba(0,0,0,0.12)",
                        backgroundColor: active ? theme.red : "white",
                      },
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: active ? theme.fontBold : theme.font,
                        color: active ? "white" : theme.text,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Sort controls */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingRight: 12,
                paddingLeft: 6,
              }}
            >
              <Pressable
                onPress={() => {
                  setSortField((f) => (f === "createdAt" ? "updatedAt" : "createdAt"));
                  setPage(1);
                }}
                style={({ pressed }) => [
                  {
                    height: 32,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={{ fontSize: 11, fontFamily: theme.fontBold, color: theme.text }}>
                  {sortField === "createdAt" ? "Created" : "Updated"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSortDir((d) => (d === "desc" ? "asc" : "desc"));
                  setPage(1);
                }}
                style={({ pressed }) => [
                  {
                    height: 32,
                    width: 32,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                {sortDir === "desc" ? (
                  <ArrowDown size={14} color={theme.red} strokeWidth={2.5} />
                ) : (
                  <ArrowUp size={14} color={theme.red} strokeWidth={2.5} />
                )}
              </Pressable>
            </View>
          </View>

          {error && (
            <View style={{ paddingHorizontal: 15 }}>
              <Text style={{ color: theme.red }}>
                Could not load courses. Please try again.
              </Text>
            </View>
          )}

          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={theme.red} />
            </View>
          ) : (
            <FlatList
              data={courses}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{
                paddingHorizontal: 10,
                gap: 10,
                paddingBottom: 12,
                marginTop: 4,
              }}
              columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
              renderItem={renderCourse}
              ListEmptyComponent={
                <Text style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}>
                  No courses match your filters.
                </Text>
              }
            />
          )}

          {totalPages > 0 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
        </>
      )}

      {currentTab === "applied" && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={[globalStyle.text, { color: theme.red }]}>Coming soon</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
