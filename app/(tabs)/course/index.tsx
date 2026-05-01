import { useCallback, useState } from "react";
import { router } from "expo-router";
import { useIsLoggedIn } from "@/src/hooks/useIsLoggedIn";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react-native";
import { NavBar } from "@/src/components/NavBar";
import Pagination from "@/src/components/Pagination";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useCourseListQuery } from "@/src/hooks/useCourseListQuery";
import { useMyCourses } from "@/src/hooks/useMyCourses";
import { useCertificateApplications } from "@/src/hooks/useCertificateApplications";
import type { CertApplicationPublic } from "@/src/api/fetchCertificateApplications";
import * as Linking from "expo-linking";
import { useIsFocused } from "@react-navigation/native";
import { CourseCard } from "@/src/components/course/CourseCard";
import { AUDIENCE_LABELS } from "@/src/types/audience";
import type { CourseListItem } from "@/src/types/course";
import type { ListRenderItem } from "react-native";

type Tab = "browse" | "enrolled" | "certification";
type SortField = "createdAt" | "updatedAt";
type SortDir = "asc" | "desc";

const TABS: { key: Tab; label: string }[] = [
  { key: "browse", label: "Browse" },
  { key: "enrolled", label: "Enrolled" },
  { key: "certification", label: "Certification" },
];

const AUDIENCES = Object.entries(AUDIENCE_LABELS) as [string, string][];
const PAGE_SIZE = 12;

export default function CourseIndex() {
  const globalStyle = styleFactory();
  const [currentTab, setCurrentTab] = useState<Tab>("browse");
  const isFocused = useIsFocused();
  const loggedIn = useIsLoggedIn();
  const {
    data: myCourses,
    isLoading: myLoading,
    error: myError,
  } = useMyCourses({ enabled: isFocused && currentTab === "enrolled" && loggedIn === true });
  const {
    data: certApps,
    isLoading: certLoading,
    error: certError,
  } = useCertificateApplications({
    enabled: isFocused && currentTab === "certification",
  });
  const [search, setSearch] = useState("");
  const [selectedAudiences, setSelectedAudiences] = useState<Set<string>>(
    new Set(),
  );
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCourseListQuery({
    enabled: isFocused,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    search: search.trim() || undefined,
    audiences:
      selectedAudiences.size > 0 ? [...selectedAudiences].join(",") : undefined,
    sortField,
    sortOrder: sortDir,
  });

  const courses = data?.data ?? [];
  const totalPages =
    data?.meta?.totalPages ?? Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE);

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
    <View style={globalStyle.screen}>
      <NavBar
        title="Courses"
        tabs={TABS}
        currentTab={currentTab}
        currentTabSetter={setCurrentTab}
      />

      {currentTab === "browse" && (
        <>
          {/* Search bar */}
          <View
            style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}
          >
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
                <Pressable
                  onPress={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  hitSlop={8}
                >
                  <X size={14} color="#aaa" strokeWidth={2.5} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Audience filter chips + sort controls */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 8,
            }}
          >
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
                  setSortField((f) =>
                    f === "createdAt" ? "updatedAt" : "createdAt",
                  );
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
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: theme.fontBold,
                    color: theme.text,
                  }}
                >
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
            <View style={{ paddingHorizontal: 15, paddingTop: 8 }}>
              <Text style={{ color: theme.red }}>
                Could not load courses. Please try again.
              </Text>
            </View>
          )}

          {isLoading ? (
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
              data={courses}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{
                paddingHorizontal: 10,
                gap: 10,
                paddingBottom: 12,
                paddingTop: 8,
              }}
              columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
              renderItem={renderCourse}
              ListEmptyComponent={
                <Text
                  style={[
                    globalStyle.text,
                    { textAlign: "center", marginTop: 60 },
                  ]}
                >
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

      {currentTab === "enrolled" &&
        (loggedIn === false ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, gap: 16 }}
          >
            <Text style={[globalStyle.text, { textAlign: "center" }]}>
              Sign in to view your enrolled courses.
            </Text>
            <Pressable
              onPress={() => router.push({ pathname: "/login", params: { from: "account" } })}
              style={({ pressed }) => [
                {
                  backgroundColor: theme.red,
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  borderRadius: 10,
                },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 15 }}>
                Login
              </Text>
            </Pressable>
          </View>
        ) : myLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={theme.red} />
          </View>
        ) : myError ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text style={[globalStyle.text, { textAlign: "center", color: theme.red }]}>
              Could not load enrolled courses. Please try again.
            </Text>
          </View>
        ) : !myCourses?.length ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text style={[globalStyle.text, { textAlign: "center" }]}>
              You are not enrolled in any courses yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={myCourses}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: 10,
              gap: 10,
              paddingBottom: 12,
              paddingTop: 16,
            }}
            columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
            renderItem={renderCourse}
          />
        ))}
      {currentTab === "certification" &&
        (certLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={theme.red} />
          </View>
        ) : certError ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={[
                globalStyle.text,
                { textAlign: "center", color: theme.red },
              ]}
            >
              Could not load certificate applications. Please try again.
            </Text>
          </View>
        ) : !certApps?.length ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text style={[globalStyle.text, { textAlign: "center" }]}>
              No certificate applications available at the moment.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              gap: 14,
              flex: 1,
              justifyContent: "center",
              // alignItems: "center",
            }}
          >
            {certApps.map((item) => (
              <CertApplicationCard key={item.id} item={item} />
            ))}
          </ScrollView>
        ))}
    </View>
  );
}

function certStatus(
  openFrom?: Date | null,
  openUntil?: Date | null,
): "upcoming" | "open" | "closed" {
  const now = new Date();
  if (openFrom && now < openFrom) return "upcoming";
  if (openUntil && now > openUntil) return "closed";
  return "open";
}

const STATUS_STYLE = {
  upcoming: {
    bg: "rgba(234,179,8,0.12)",
    color: "rgb(161,98,7)",
    label: "Upcoming",
  },
  open: { bg: "rgba(34,197,94,0.12)", color: "rgb(22,163,74)", label: "Open" },
  closed: {
    bg: "rgba(0,0,0,0.07)",
    color: "rgb(100,100,100)",
    label: "Closed",
  },
};

function CertApplicationCard({ item }: { item: CertApplicationPublic }) {
  const dateStr = (d?: Date | null) =>
    d
      ? d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  const openFrom = dateStr(item.openFrom);
  const openUntil = dateStr(item.openUntil);
  const status = certStatus(item.openFrom, item.openUntil);
  const s = STATUS_STYLE[status];

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        // overflow: "hidden",
        padding: 16,
        gap: 12,
        justifyContent: "center",
        // borderWidth: 1,
        // borderColor: "hsl(0 0% 95%)",
        // shadowColor: "#000",
        // shadowOpacity: 0.01,
        // shadowRadius: 8,
        // elevation: 1,
        alignItems: "center",
      }}
    >
      {/* Title + status badge */}
      <Text
        style={{
          fontFamily: theme.fontBold,
          fontSize: 17,
          color: theme.sectionHeadingColor,
        }}
      >
        Apply For Certification Below
      </Text>
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 20,
          backgroundColor: s.bg,
        }}
      >
        <Text
          style={{ fontSize: 12, fontFamily: theme.fontBold, color: s.color }}
        >
          {s.label}
        </Text>
      </View>

      {/* Dates */}
      {(openFrom || openUntil) && (
        <View
          style={{ flexDirection: "row", gap: 24, justifyContent: "center" }}
        >
          {openFrom && (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 10,
                  color: "#999",
                  fontFamily: theme.font,
                  marginBottom: 2,
                }}
              >
                Opens
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.font,
                  color: theme.text,
                }}
              >
                {openFrom}
              </Text>
            </View>
          )}
          {openUntil && (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 10,
                  color: "#999",
                  fontFamily: theme.font,
                  marginBottom: 2,
                }}
              >
                Closes
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.font,
                  color: theme.text,
                }}
              >
                {openUntil}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Action */}
      {status === "open" && item.formUrl ? (
        <Pressable
          onPress={async () => {
            try {
              await Linking.openURL(item.formUrl!);
            } catch {
              Alert.alert("Error", "Could not open the application form.");
            }
          }}
          style={({ pressed }) => [
            {
              backgroundColor: theme.red,
              borderRadius: 5,
              paddingVertical: 11,
              paddingHorizontal: 32,
              alignItems: "center",
              alignSelf: "stretch",
            },
            pressed && { opacity: 0.82 },
          ]}
        >
          <Text
            style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14 }}
          >
            Apply Now
          </Text>
        </Pressable>
      ) : (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 10,
            paddingVertical: 11,
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Text style={{ color: "#888", fontFamily: theme.font, fontSize: 13 }}>
            {item.message ||
              (status === "upcoming"
                ? "Applications not yet open."
                : "Applications are closed.")}
          </Text>
        </View>
      )}
    </View>
  );
}
