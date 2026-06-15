import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ChevronLeft, ShieldAlert, ShoppingCart } from "lucide-react-native";
import { Image } from "expo-image";
import { useIsFocused } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

import { useCourseQuery } from "@/src/hooks/useCourseQuery";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { purchaseCourse } from "@/src/lib/purchases";
import { verifyPurchase } from "@/src/api/purchaseCourse";
import { queryKeys } from "@/src/lib/queryKeys";

export default function BuyCourse() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [purchasing, setPurchasing] = useState(false);

  const {
    data: course,
    isLoading,
    error,
  } = useCourseQuery(id, { enabled: isFocused });

  const handlePurchase = async () => {
    if (!course) return;

    setPurchasing(true);
    try {
      // Step 1: Trigger the in-app purchase (stub in Phase 1).
      const { receiptToken } = await purchaseCourse(course.id);

      // Step 2: Verify the receipt on our backend and enroll the user.
      await verifyPurchase(course.id, receiptToken);

      // Step 3: Invalidate queries so enrollment state refreshes.
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });

      Alert.alert(
        "Purchase Successful!",
        `You now have full access to "${course.title}".`,
        [{ text: "Start Learning", onPress: () => router.back() }]
      );
    } catch (err: any) {
      if (err?.message?.includes("cancelled")) {
        // User cancelled the purchase — do nothing.
        return;
      }
      Alert.alert(
        "Purchase Failed",
        err?.message ?? "Something went wrong. Please try again."
      );
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.red} />
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center", padding: 20 },
        ]}
      >
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          {error ? "Could not load course" : "Course not found"}
        </Text>
      </SafeAreaView>
    );
  }

  const price = course.price ?? 0;
  const thumbnailUri = course.thumbnail?.url;

  return (
    <SafeAreaView
      style={globalStyle.screen}
      edges={["left", "right", "bottom"]}
    >
      {/* Header */}
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
            { paddingVertical: 3, borderRadius: 8 },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={32} color="white" strokeWidth={1} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: "white",
            marginLeft: 8,
          }}
          numberOfLines={1}
        >
          Purchase Course
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Thumbnail */}
        {thumbnailUri ? (
          <View
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
              marginBottom: 20,
            }}
          >
            <Image
              source={{ uri: thumbnailUri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
              borderRadius: 16,
              backgroundColor: "#f5f5f5",
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={48} color="#ccc" strokeWidth={1} />
          </View>
        )}

        {/* Course Title */}
        <Text
          style={{
            fontSize: 22,
            fontFamily: theme.fontBold,
            color: theme.text,
            marginBottom: 8,
          }}
        >
          {course.title}
        </Text>

        {/* Price */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontFamily: theme.fontBold,
              color: theme.red,
            }}
          >
            ₹{price}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: theme.font,
              color: "#999",
              marginLeft: 8,
            }}
          >
            one-time payment
          </Text>
        </View>

        {/* No Refund Disclaimer */}
        <View
          style={{
            backgroundColor: "#FFF8F0",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#FFE0C0",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <ShieldAlert size={20} color="#D97706" strokeWidth={2} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: theme.fontBold,
                color: "#92400E",
              }}
            >
              No Refund Policy
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: theme.font,
              color: "#78350F",
              lineHeight: 20,
            }}
          >
            All purchases are final. No refunds will be issued once the course
            is purchased. By proceeding with the purchase, you acknowledge and
            agree to these terms.
          </Text>
        </View>

        {/* What you get */}
        {course.chapters.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: theme.fontBold,
                color: theme.text,
                marginBottom: 10,
              }}
            >
              What you'll get
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: theme.font,
                color: "#666",
                lineHeight: 22,
              }}
            >
              • Full access to all {course.chapters.length} chapter
              {course.chapters.length !== 1 ? "s" : ""}
              {"\n"}• Downloadable course materials{"\n"}• Lifetime access to
              course content
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.07)",
          backgroundColor: "white",
          gap: 10,
        }}
      >
        <Pressable
          onPress={handlePurchase}
          disabled={purchasing}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              backgroundColor: theme.red,
              paddingVertical: 15,
              borderRadius: 12,
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            purchasing && { opacity: 0.6 },
          ]}
        >
          {purchasing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ShoppingCart size={20} color="white" strokeWidth={2} />
          )}
          <Text
            style={{
              color: "white",
              fontFamily: theme.fontBold,
              fontSize: 16,
            }}
          >
            {purchasing ? "Processing..." : `Confirm Purchase — ₹${price}`}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          disabled={purchasing}
          style={({ pressed }) => [
            {
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: "#ddd",
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text
            style={{
              color: "#888",
              fontFamily: theme.fontBold,
              fontSize: 15,
            }}
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
