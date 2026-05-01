import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
  PanResponder,
} from "react-native";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/src/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CELL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);

// Top grid (above text): rows 0-1
// Bottom grid (below text): rows 2-3
// Each row has 2 images side by side.
// fromLeft alternates per cell so adjacent cells come from opposite sides.
// Images drift in slowly across the 3-second audio — first at 300ms, last at ~2.8s
const IMAGES = [
  { source: require("../../assets/splashimages/1_s.png"),  fromLeft: true,  delay: 300  },
  { source: require("../../assets/splashimages/13_s.png"), fromLeft: true,  delay: 550  },
  { source: require("../../assets/splashimages/3_s.png"),  fromLeft: false, delay: 800  },
  { source: require("../../assets/splashimages/18_s.png"), fromLeft: false, delay: 1050 },
  { source: require("../../assets/splashimages/6_s.png"),  fromLeft: false, delay: 1300 },
  { source: require("../../assets/splashimages/3.jpg"),    fromLeft: false, delay: 1550 },
  { source: require("../../assets/splashimages/9_s.png"),  fromLeft: true,  delay: 1800 },
  { source: require("../../assets/splashimages/5_s.gif"),  fromLeft: true,  delay: 2050 },
];

const TOP_IMAGES = IMAGES.slice(0, 4);
const BOTTOM_IMAGES = IMAGES.slice(4);

function SplashCell({
  source,
  fromLeft,
  delay,
  onLoad,
  started,
  isLeft,
}: {
  source: ReturnType<typeof require>;
  fromLeft: boolean;
  delay: number;
  onLoad: () => void;
  started: boolean;
  isLeft: boolean;
}) {
  const translateX = useSharedValue(fromLeft ? -SCREEN_WIDTH : SCREEN_WIDTH);

  useEffect(() => {
    if (!started) return;
    translateX.value = withDelay(
      delay,
      withSpring(0, { damping: 28, stiffness: 55, mass: 1.2 }),
    );
  }, [started]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.cell, animStyle]}>
      <Image
        source={source}
        style={styles.cellImage}
        resizeMode="cover"
        onLoad={onLoad}
        onError={onLoad} // count errors too so we never get stuck
      />
      {/* top fade */}
      <LinearGradient
        colors={["white", "transparent"] as const}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.38 }}
        pointerEvents="none"
      />
      {/* bottom fade */}
      <LinearGradient
        colors={["transparent", "white"] as const}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.62 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
      />
      {/* outer edge fade */}
      <LinearGradient
        colors={["white", "transparent"] as const}
        style={StyleSheet.absoluteFill}
        start={{ x: isLeft ? 0 : 1, y: 0 }}
        end={{ x: isLeft ? 0.22 : 0.78, y: 0 }}
        pointerEvents="none"
      />
      {/* inner edge fade (between cells) */}
      <LinearGradient
        colors={["transparent", "white"] as const}
        style={StyleSheet.absoluteFill}
        start={{ x: isLeft ? 0.78 : 0.22, y: 0 }}
        end={{ x: isLeft ? 1 : 0, y: 0 }}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

function ImageGrid({
  images,
  onLoad,
  started,
}: {
  images: typeof TOP_IMAGES;
  onLoad: () => void;
  started: boolean;
}) {
  return (
    <View style={styles.grid}>
      {/* Row 1 */}
      <View style={styles.row}>
        <SplashCell {...images[0]} onLoad={onLoad} started={started} isLeft={true} />
        <SplashCell {...images[1]} onLoad={onLoad} started={started} isLeft={false} />
      </View>
      {/* Row 2 */}
      <View style={styles.row}>
        <SplashCell {...images[2]} onLoad={onLoad} started={started} isLeft={true} />
        <SplashCell {...images[3]} onLoad={onLoad} started={started} isLeft={false} />
      </View>
    </View>
  );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [started, setStarted] = useState(false);
  const handleLoad = useCallback(() => setLoadedCount((c) => c + 1), []);

  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(14);
  const subtitleOpacity = useSharedValue(0);

  const dismissY = useRef(new RNAnimated.Value(0)).current;
  const dismissOpacity = useRef(new RNAnimated.Value(1)).current;
  const hintOpacity = useRef(new RNAnimated.Value(0)).current;
  const hintBounce = useRef(new RNAnimated.Value(0)).current;

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isDismissing = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const soundRef = useRef<Audio.Sound | null>(null);

  function dismiss() {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    soundRef.current?.stopAsync().catch(() => {});
    soundRef.current?.unloadAsync().catch(() => {});
    RNAnimated.parallel([
      RNAnimated.timing(dismissY, {
        toValue: -SCREEN_HEIGHT,
        duration: 380,
        useNativeDriver: true,
      }),
      RNAnimated.timing(dismissOpacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => onFinishRef.current());
  }

  const dismissRef = useRef(dismiss);
  dismissRef.current = dismiss;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy < -8,
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -60 || gs.vy < -0.4) dismissRef.current();
      },
    }),
  ).current;

  // Start once all images loaded, or after 3s fallback (covers gifs/errors)
  useEffect(() => {
    const fallback = setTimeout(() => setStarted(true), 3000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (loadedCount >= IMAGES.length) setStarted(true);
  }, [loadedCount]);

  useEffect(() => {
    if (!started) return;

    Audio.setAudioModeAsync({ playsInSilentModeIOS: false }).catch(() => {});
    // Delay audio by 1600ms so it's 1 second in when the text appears at 2600ms
    setTimeout(() => {
      Audio.Sound.createAsync(
        require("../../assets/splashscreenaudio.mp3"),
        { shouldPlay: true, isLooping: false, volume: 0.6 },
      ).then(({ sound }) => {
        soundRef.current = sound;
      }).catch(() => {});
    }, 1600);

    textOpacity.value = withDelay(2600, withTiming(1, { duration: 700 }));
    textY.value = withDelay(2600, withSpring(0, { damping: 14, stiffness: 90 }));
    subtitleOpacity.value = withDelay(3100, withTiming(1, { duration: 600 }));

    const hintTimer = setTimeout(() => {
      RNAnimated.timing(hintOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        RNAnimated.loop(
          RNAnimated.sequence([
            RNAnimated.timing(hintBounce, { toValue: -7, duration: 480, useNativeDriver: true }),
            RNAnimated.timing(hintBounce, { toValue: 0, duration: 480, useNativeDriver: true }),
          ]),
        ).start();
      });
    }, 4500);

    timerRef.current = setTimeout(() => dismissRef.current(), 15000);

    return () => {
      clearTimeout(hintTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [started]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <RNAnimated.View
      style={[
        styles.container,
        { transform: [{ translateY: dismissY }], opacity: dismissOpacity },
      ]}
      {...panResponder.panHandlers}
    >
      <ImageGrid images={TOP_IMAGES} onLoad={handleLoad} started={started} />

      <View style={styles.textSection}>
        <Animated.Text style={[styles.title, textStyle]}>
          Expressions India
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Nurturing Minds, Enriching Lives
        </Animated.Text>
      </View>

      <ImageGrid images={BOTTOM_IMAGES} onLoad={handleLoad} started={started} />

      <RNAnimated.View style={[styles.hint, { opacity: hintOpacity }]}>
        <RNAnimated.Text
          style={[styles.hintArrow, { transform: [{ translateY: hintBounce }] }]}
        >
          ↑
        </RNAnimated.Text>
        <Text style={styles.hintText}>Swipe up to continue</Text>
      </RNAnimated.View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  grid: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  cell: {
    width: SCREEN_WIDTH / 2,
    height: CELL_HEIGHT,
    overflow: "hidden",
  },
  cellImage: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  title: {
    fontFamily: "Delius_400Regular",
    fontSize: 30,
    color: theme.sectionHeadingColor,
    letterSpacing: 0.8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: theme.font,
    fontSize: 13,
    color: theme.text,
    marginTop: 5,
    letterSpacing: 0.4,
    opacity: 0.65,
    textAlign: "center",
  },
  hint: {
    position: "absolute",
    bottom: 44,
    alignSelf: "center",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  hintArrow: {
    fontSize: 18,
    color: theme.sectionHeadingColor,
  },
  hintText: {
    fontFamily: theme.fontBold,
    fontSize: 13,
    color: theme.sectionHeadingColor,
    letterSpacing: 0.3,
  },
});
