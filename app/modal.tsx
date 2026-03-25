import { View, Text, Image, Dimensions } from "react-native";
// import { Image } from "expo-image";
import { useImageContext } from "@/src/context/imageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
export default function Modal() {
  const { image } = useImageContext();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
      savedScale.value = scale.value;
    });
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        const sensitivity = 1 / scale.value;
        translateX.value = savedTranslateX.value + e.translationX * sensitivity;
        translateY.value = savedTranslateY.value + e.translationY * sensitivity;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });
  if (!image) return null;
  const source = typeof image === "string" ? { uri: image } : image;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <StatusBar backgroundColor="black" />
        <GestureDetector gesture={composed}>
          <Animated.View
            style={[
              animatedStyle,
              {
                width: Dimensions.get("window").width,
              },
            ]}
          >
            <Animated.Image
              source={source}
              style={{
                width: "100%",
                aspectRatio: 1,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
