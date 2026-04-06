import Animated, {
  interpolate,
  useAnimatedStyle,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import { theme } from "../theme";
import { styleFactory } from "../styleFactory";
import { Dimensions, View } from "react-native";

function AnimatedDot({
  index,
  width,
  scrollX,
}: {
  index: number;
  width: number;
  scrollX: SharedValue<number>;
}) {
  const globalStyle = styleFactory();
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const scale = interpolate(scrollX.value, inputRange, [1, 1.5, 1], "clamp");
    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      "hsl(4 84.2% 81.9%)",
      theme.sectionHeadingColor,
      "hsl(4 84.2% 81.9%)",
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
        <AnimatedDot key={index} index={index} width={screenWidth} scrollX={scrollX} />
      ))}
    </View>
  );
}
