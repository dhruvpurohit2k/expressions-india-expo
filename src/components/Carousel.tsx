import { Image, View, Dimensions, FlatList } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import AnimatedDots from "./AnimatedDots";
import { useEffect, useRef, useMemo } from "react";
import { theme } from "../theme";

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
  }, [count]); // Re-run whenever the number of images changes

  // Auto-scroll timer
  useEffect(() => {
    if (count === 0) return;
    const timer = setInterval(() => {
      if (!flatListRef.current) return;

      let nextIndex = currentIndexRef.current + 1;

      // Approaching the end — silently jump to the equivalent middle position
      if (nextIndex >= extendedImages.length - count) {
        nextIndex = START_INDEX + (nextIndex % count);
        currentIndexRef.current = nextIndex;
        flatListRef.current.scrollToOffset({
          offset: nextIndex * ITEM_WIDTH,
          animated: false,
        });
        return;
      }

      currentIndexRef.current = nextIndex;
      // scrollToOffset avoids the silent failure that scrollToIndex has
      // when the target item is outside the FlatList render window
      flatListRef.current.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [count, extendedImages, ITEM_WIDTH, START_INDEX]);

  // If no images exist, exit early
  if (count === 0) return null;

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <CarouselItem
        item={item}
        index={index}
        scrollX={scrollX}
        itemWidth={ITEM_WIDTH}
      />
    );
  };

  return (
    <View style={{ height: 320, paddingVertical: 10 }}>
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
          paddingHorizontal: SPACING,
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScroll={scrollHandler}
        onMomentumScrollEnd={(event) => {
          currentIndexRef.current = Math.round(
            event.nativeEvent.contentOffset.x / ITEM_WIDTH,
          );
        }}
        style={{
          flex: 1,
        }}
        renderItem={renderItem}
      />
      <View style={{ marginTop: 10 }}>
        <AnimatedDots
          scrollX={normalizedScrollX}
          count={count}
          itemWidth={ITEM_WIDTH}
        />
      </View>
    </View>
  );
}

function CarouselItem({
  item,
  index,
  scrollX,
  itemWidth,
}: {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * itemWidth;
    const inputRange = [
      position - itemWidth,
      position,
      position + itemWidth,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1, 0.85],
      "clamp"
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      "clamp"
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: itemWidth,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          width: "95%",
          height: "100%",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: theme.backgroundColorLight,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Image
          source={typeof item === "string" ? { uri: item } : (item as any)}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
}
