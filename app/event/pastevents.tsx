import AnimatedDots from "@/src/components/AnimatedDots";
import { useImageContext } from "@/src/context/imageContext";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { Link } from "expo-router";
import React from "react";
import {
  Pressable,
  Dimensions,
  Image,
  Text,
  View,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePastEventQuery } from "@/src/hooks/usePastEventQuery";

export default function PastEvents() {
  const { data: pastEventResponse, isLoading, error } = usePastEventQuery({});

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ backgroundColor: theme.backgroundColorLight, flex: 1 }}
      >
        <Text style={{ padding: 16 }}>Loading past events...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ backgroundColor: theme.backgroundColorLight, flex: 1 }}
      >
        <Text style={{ padding: 16, color: "red" }}>
          Error loading past events
        </Text>
      </SafeAreaView>
    );
  }

  const events = pastEventResponse?.data ?? [];

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.backgroundColorLight, flex: 1 }}
    >
      <ScrollView style={{ flex: 1 }}>
        {events.map((event, i) => (
          <Event key={event.id} event={event} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Event({ event }: { event: { id: string; name: string; images?: string } }) {
  const scrollX = useSharedValue<number>(0);
  const { setImage } = useImageContext();
  const globalStyle = styleFactory();
  const screenWidth = Dimensions.get("window").width;

  const scrollHandler = useAnimatedScrollHandler((scrollEvent) => {
    scrollX.value = scrollEvent.contentOffset.x;
  });

  let images: string[] = [];
  if (event.images) {
    try {
      images = JSON.parse(event.images);
    } catch (e) {
      console.error("Failed to parse event images:", e);
    }
  }

  return (
    <View
      style={{
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: theme.backgroundColor,
        borderRadius: 10,
        marginVertical: 20,
        marginHorizontal: 10,
        alignItems: "center",
      }}
    >
      <Text style={globalStyle.text}>{event.name}</Text>
      <Animated.ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={"fast"}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        style={{
          // marginHorizontal: 10,
          borderRadius: 10,
        }}
      >
        {images.map((image, i) => (
          <View
            key={i}
            style={{
              padding: 10,
              backgroundColor: theme.backgroundColorLight,
              // borderRadius: 10,
              // marginHorizontal: 10,
              // marginVertical: 10,
            }}
          >
            <Link href="/modal" asChild>
              <Pressable onPress={() => setImage(image)}>
                <Image
                  source={image}
                  style={{
                    width: screenWidth - 70,
                    height: 350,
                  }}
                  resizeMode="contain"
                />
              </Pressable>
            </Link>
          </View>
        ))}
      </Animated.ScrollView>
      <AnimatedDots scrollX={scrollX} count={images.length} />
    </View>
  );
}
