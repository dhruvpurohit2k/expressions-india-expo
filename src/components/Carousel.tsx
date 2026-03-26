import { Image, View, Dimensions, FlatList } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import AnimatedDots from "./AnimatedDots";
import { useEffect, useRef, useMemo } from "react";

export default function Carousel({ images }: { images: string[] }) {
  const scrollX = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;

  const ITEM_WIDTH = screenWidth * 0.8;
  const SPACING = (screenWidth - ITEM_WIDTH) / 2;

  const count = images?.length || 0;

  // Derive the normalized scrollX for AnimatedDots
  const normalizedScrollX = useDerivedValue(() => {
    if (count === 0) return 0;
    // adding a large multiple of total length to handle negative scroll naturally
    const totalLength = ITEM_WIDTH * count;
    return ((scrollX.value % totalLength) + totalLength) % totalLength;
  });

  const REPEAT_COUNT = 100;
  const extendedImages = useMemo(() => {
    if (count === 0) return [];
    return Array(REPEAT_COUNT).fill(images).flat();
  }, [images, count]);

  const flatListRef = useRef<FlatList>(null);

  // Choose a middle starting index that aligns with the first image in the original array
  const START_INDEX = Math.floor(REPEAT_COUNT / 2) * count;
  const currentIndexRef = useRef(START_INDEX);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Scroll to middle on mount (avoids initialScrollIndex crash when data isn't ready)
  useEffect(() => {
    if (count === 0 || extendedImages.length === 0) return;
    // Small delay to ensure FlatList has rendered with data
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: START_INDEX * ITEM_WIDTH,
        animated: false,
      });
      currentIndexRef.current = START_INDEX;
    }, 50);
    return () => clearTimeout(timeout);
  }, [count > 0]); // Only run once when images become available

  // Auto-scroll timer
  useEffect(() => {
    if (count === 0) return;
    const timer = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex < extendedImages.length) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          currentIndexRef.current = nextIndex;
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [count, extendedImages]);

  // If no images exist, exit early
  if (count === 0) return null;

  return (
    <View style={{ height: 300 }}>
      {/* We use AnimatedFlatList to correctly capture onScroll */}
      <Animated.FlatList
        ref={flatListRef}
        data={extendedImages}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment={"center"}
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SPACING, // This centers the current item and lets adjacent items peek
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScroll={scrollHandler}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / ITEM_WIDTH,
          );
          currentIndexRef.current = newIndex;
        }}
        style={{ flex: 1, borderRadius: 10 }}
        renderItem={({ item, index }) => (
          <View style={{ width: ITEM_WIDTH, paddingHorizontal: 5 }}>
            <Image
              source={typeof item === "string" ? { uri: item } : (item as any)}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        )}
      />
      <AnimatedDots
        scrollX={normalizedScrollX}
        count={count}
        itemWidth={ITEM_WIDTH}
      />
    </View>
  );
}
