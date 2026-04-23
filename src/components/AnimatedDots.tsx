import Animated, {
  interpolate,
  useAnimatedStyle,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import { styleFactory } from "../styleFactory";
import { Dimensions, View } from "react-native";

function AnimatedDot({
  index,
  count,
  width,
  scrollX,
}: {
  index: number;
  count: number;
  width: number;
  scrollX: SharedValue<number>;
}) {
  const globalStyle = styleFactory();
  const animatedDotStyle = useAnimatedStyle(() => {
    const total = width * count;
    const pos = index * width;
    // Shortest circular distance so the wrap-around transition is smooth
    let dx = scrollX.value - pos;
    dx = ((dx + total / 2) % total + total) % total - total / 2;
    const inputRange = [-width, 0, width];
    const scale = interpolate(dx, inputRange, [0.5, 1, 0.5], "clamp");
    const backgroundColor = interpolateColor(dx, inputRange, [
      "hsl(4 84.2% 91.9%)",
      "hsl(4, 84.2%, 51.9%)",
      "hsl(4 84.2% 91.9%)",
    ]);
    return {
      transform: [{ scale }],
      backgroundColor,
    };
  });
  return (
    <Animated.View style={[globalStyle.swipeDotInActive, animatedDotStyle]} />
  );
}

export default function AnimatedDots({
  scrollX,
  count,
  itemWidth,
}: {
  scrollX: SharedValue<number>;
  count: number;
  itemWidth?: number;
}) {
  const screenWidth = itemWidth || Dimensions.get("window").width;
  const globalStyle = styleFactory();
  return (
    <View style={globalStyle.swipeDotIndicatorContainer}>
      {Array.from({ length: count }, (_, i) => i).map((index) => (
        <AnimatedDot
          key={index}
          index={index}
          count={count}
          width={screenWidth}
          scrollX={scrollX}
        />
      ))}
    </View>
  );
}
