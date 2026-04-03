import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { styleFactory } from "../styleFactory";
import { theme } from "../theme";
import events from "@/data/events/events";
import Animated, {
  Easing,
  FadeInLeft,
  SlideInDown,
  SlideInLeft,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import AnimatedDots from "./AnimatedDots";
import { useImageContext } from "../context/imageContext";
import { Link } from "expo-router";
import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";
import { useIsFocused } from "@react-navigation/native";

const globalStyle = styleFactory();
const screenWidth = Dimensions.get("window").width;
export default function Events() {
  // const isFocused = useIsFocused();
  // if (!isFocused) return null;
  return (
    <Animated.View style={[globalStyle.screen]}>
      <Animated.View entering={SlideInLeft.duration(700).delay(50)}>
        <UpcomingEvents />
      </Animated.View>
      <Animated.View entering={SlideInDown.duration(700).delay(200)}>
        <PastEvents />
      </Animated.View>
    </Animated.View>
  );
}
