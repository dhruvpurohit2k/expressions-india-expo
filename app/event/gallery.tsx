import { useImageContext } from "@/src/context/imageContext";
import { theme } from "@/src/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_GAP = 8;
const HORIZONTAL_PAD = 15;
const COLUMNS = 3;
const THUMB_SIZE =
  (SCREEN_WIDTH - HORIZONTAL_PAD * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;

export default function Gallery() {
  const { urls } = useLocalSearchParams<{ urls: string }>();
  const { setImage } = useImageContext();
  const insets = useSafeAreaInsets();

  let images: string[] = [];
  try {
    images = urls ? JSON.parse(urls) : [];
  } catch (e) {
    console.error("Failed to parse gallery images:", e);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}
      edges={["left", "right", "bottom"]}
    >
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
            {
              padding: 6,
              borderRadius: 8,
            },
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
            marginLeft: 10,
          }}
        >
          Gallery
        </Text>
      </View>

      {images.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: theme.text }}>No images.</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(_, i) => String(i)}
          numColumns={COLUMNS}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PAD,
            paddingBottom: 20,
          }}
          columnWrapperStyle={{ gap: COLUMN_GAP, marginBottom: COLUMN_GAP }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setImage(item);
                router.push("/modal");
              }}
              style={({ pressed }) => [
                pressed && { opacity: 0.8 },
              ]}
            >
              <Animated.Image
                source={{ uri: item }}
                style={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: 8,
                  backgroundColor: theme.backgroundColorDark,
                }}
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
