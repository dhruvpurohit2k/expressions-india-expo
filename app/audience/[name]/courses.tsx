import { useCoursesByAudience } from "@/src/hooks/useCoursesByAudience";
import { AUDIENCE_LABELS } from "@/src/types/audience";
import { CourseCard } from "@/src/components/course/CourseCard";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { useIsFocused  } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import type { CourseListItem } from "@/src/types/course";
import type { ListRenderItem } from "react-native";

const LIMIT = 10;

export default function AudienceCourses() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const globalStyle = styleFactory();
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useCoursesByAudience({
    audience: name,
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
    enabled: isFocused,
  });

  const courses = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const label = AUDIENCE_LABELS[name] ?? name;

  const renderCourse: ListRenderItem<CourseListItem> = ({ item, index }) => (
    <CourseCard item={item} index={index} />
  );

  return (
    <SafeAreaView style={globalStyle.screen} edges={["left", "right", "bottom"]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingTop: insets.top + 10,
          gap: 10,
          backgroundColor: theme.red,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            { padding: 6, borderRadius: 8 },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={24} color="white" strokeWidth={2} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: "white",
            flex: 1,
          }}
          numberOfLines={1}
        >
          Courses for {label}
        </Text>
      </Animated.View>

      {error && (
        <Text style={{ color: theme.red, paddingHorizontal: 15 }}>
          Could not load courses.
        </Text>
      )}

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
            paddingTop: 12,
            paddingBottom: 12,
          }}
          columnWrapperStyle={{ gap: 10, paddingHorizontal: 5 }}
          renderItem={renderCourse}
          ListEmptyComponent={
            <Animated.Text
              entering={FadeInUp.duration(400).delay(200)}
              style={[globalStyle.text, { textAlign: "center", marginTop: 40 }]}
            >
              No courses for {label}.
            </Animated.Text>
          }
        />
      )}

      {totalPages > 1 && (
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
              { flexDirection: "row", alignItems: "center", backgroundColor: theme.red, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, opacity: page === 1 ? 0.35 : 1 },
              pressed && { opacity: 0.75 },
            ]}
          >
            <ChevronLeft size={18} color="white" strokeWidth={2.5} />
            <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14, marginLeft: 2 }}>Prev</Text>
          </Pressable>
          <Text style={{ color: theme.text, fontFamily: theme.font, fontSize: 14 }}>
            {page} / {totalPages}
          </Text>
          <Pressable
            onPress={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            style={({ pressed }) => [
              { flexDirection: "row", alignItems: "center", backgroundColor: theme.red, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, opacity: page >= totalPages ? 0.35 : 1 },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={{ color: "white", fontFamily: theme.fontBold, fontSize: 14, marginRight: 2 }}>Next</Text>
            <ChevronRight size={18} color="white" strokeWidth={2.5} />
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
