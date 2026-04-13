import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated as RNAnimated,
  PanResponder,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  withSpring,
  interpolate,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Circle, G } from "react-native-svg";
import { theme } from "@/src/theme";

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CX = 150;
const CY = 150;
const SWAY_OFFSET_Y = 125;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function petalPath(
  angle: number,
  innerR: number,
  outerR: number,
  spread: number,
) {
  const rad = (angle * Math.PI) / 180;
  const radLeft = ((angle - spread) * Math.PI) / 180;
  const radRight = ((angle + spread) * Math.PI) / 180;
  const x1 = CX + innerR * Math.cos(rad);
  const y1 = CY + innerR * Math.sin(rad);
  const xTip = CX + outerR * Math.cos(rad);
  const yTip = CY + outerR * Math.sin(rad);
  const xLeft = CX + outerR * 0.6 * Math.cos(radLeft);
  const yLeft = CY + outerR * 0.6 * Math.sin(radLeft);
  const xRight = CX + outerR * 0.6 * Math.cos(radRight);
  const yRight = CY + outerR * 0.6 * Math.sin(radRight);
  return `M ${x1} ${y1} Q ${xLeft} ${yLeft} ${xTip} ${yTip} Q ${xRight} ${yRight} ${x1} ${y1} Z`;
}

const OUTER_COUNT = 8;
const INNER_COUNT = 6;

const outerPetals = Array.from({ length: OUTER_COUNT }, (_, i) => ({
  path: petalPath((360 / OUTER_COUNT) * i - 90, 8, 70, 18),
}));
const innerPetals = Array.from({ length: INNER_COUNT }, (_, i) => ({
  path: petalPath((360 / INNER_COUNT) * i - 60, 6, 45, 22),
}));

function OuterPetal({
  path,
  bloom,
  index,
}: {
  path: string;
  bloom: Animated.SharedValue<number>;
  index: number;
}) {
  const start = (index / OUTER_COUNT) * 0.55;
  const gProps = useAnimatedProps(() => {
    const p = interpolate(bloom.value, [start, start + 0.5], [0, 1], "clamp");
    return { scale: p, originX: CX, originY: CY, opacity: p };
  });
  return (
    <AnimatedG animatedProps={gProps}>
      <Path
        d={path}
        fill="hsl(4, 74%, 52%)"
        stroke="hsl(4, 84%, 35%)"
        strokeWidth={1.5}
      />
    </AnimatedG>
  );
}

function InnerPetal({
  path,
  bloom,
  index,
}: {
  path: string;
  bloom: Animated.SharedValue<number>;
  index: number;
}) {
  const start = 0.15 + (index / INNER_COUNT) * 0.45;
  const gProps = useAnimatedProps(() => {
    const p = interpolate(bloom.value, [start, start + 0.5], [0, 1], "clamp");
    return { scale: p, originX: CX, originY: CY, opacity: p };
  });
  return (
    <AnimatedG animatedProps={gProps}>
      <Path
        d={path}
        fill="hsl(4, 84%, 42%)"
        stroke="hsl(4, 70%, 30%)"
        strokeWidth={1}
      />
    </AnimatedG>
  );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  // ── Reanimated (flower) ────────────────────────────────────────────
  const stemProgress = useSharedValue(0);
  const centerScale = useSharedValue(0);
  const bloom = useSharedValue(0);
  const swayAngle = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);

  // ── RN Animated (dismiss + hint) ──────────────────────────────────
  const dismissY = useRef(new RNAnimated.Value(0)).current;
  const dismissOpacity = useRef(new RNAnimated.Value(1)).current;
  const hintOpacity = useRef(new RNAnimated.Value(0)).current;
  const hintBounce = useRef(new RNAnimated.Value(0)).current;

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isDismissing = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  function dismiss() {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
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

  // Store dismiss in a ref so PanResponder (created once) can call latest
  const dismissRef = useRef(dismiss);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy < -8,
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -60 || gs.vy < -0.4) {
          dismissRef.current();
        }
      },
    }),
  ).current;

  useEffect(() => {
    // ── Flower animations ────────────────────────────────────────────
    stemProgress.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
    centerScale.value = withDelay(
      620,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.8)) }),
    );
    bloom.value = withDelay(
      950,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
    swayAngle.value = withDelay(
      1950,
      withRepeat(
        withSequence(
          withTiming(5, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(-5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
    textOpacity.value = withDelay(1700, withTiming(1, { duration: 600 }));
    textY.value = withDelay(1700, withSpring(0, { damping: 14, stiffness: 100 }));
    subtitleOpacity.value = withDelay(2200, withTiming(1, { duration: 500 }));

    // ── Hint: fade in then bounce ────────────────────────────────────
    const hintTimer = setTimeout(() => {
      RNAnimated.timing(hintOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        RNAnimated.loop(
          RNAnimated.sequence([
            RNAnimated.timing(hintBounce, {
              toValue: -7,
              duration: 480,
              useNativeDriver: true,
            }),
            RNAnimated.timing(hintBounce, {
              toValue: 0,
              duration: 480,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });
    }, 2500);

    // ── Auto-dismiss ─────────────────────────────────────────────────
    timerRef.current = setTimeout(() => dismissRef.current(), 10000);

    return () => {
      clearTimeout(hintTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Animated styles (Reanimated) ──────────────────────────────────
  const stemProps = useAnimatedProps(() => {
    const h = interpolate(stemProgress.value, [0, 1], [0, 60]);
    return {
      d: `M ${CX} ${CY + 65} Q ${CX + 5} ${CY + 65 + h * 0.5} ${CX} ${CY + 65 + h}`,
      strokeWidth: 3,
      opacity: stemProgress.value,
    };
  });

  const leaf1Props = useAnimatedProps(() => {
    const p = interpolate(stemProgress.value, [0.45, 1], [0, 1], "clamp");
    return {
      d: `M ${CX} ${CY + 95} Q ${CX - 25} ${CY + 80} ${CX - 20} ${CY + 92}`,
      strokeWidth: 2,
      opacity: p,
    };
  });

  const leaf2Props = useAnimatedProps(() => {
    const p = interpolate(stemProgress.value, [0.6, 1], [0, 1], "clamp");
    return {
      d: `M ${CX} ${CY + 108} Q ${CX + 25} ${CY + 93} ${CX + 22} ${CY + 105}`,
      strokeWidth: 2,
      opacity: p,
    };
  });

  const centerProps = useAnimatedProps(() => ({
    r: interpolate(centerScale.value, [0, 1], [0, 12]),
    opacity: centerScale.value,
  }));

  const swayStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: SWAY_OFFSET_Y },
      { rotate: `${swayAngle.value}deg` },
      { translateY: -SWAY_OFFSET_Y },
    ],
  }));

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
      <View style={styles.glow} />

      <Animated.View style={swayStyle}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          <AnimatedPath
            animatedProps={stemProps}
            stroke="hsl(120, 35%, 40%)"
            fill="none"
            strokeLinecap="round"
          />
          <AnimatedPath
            animatedProps={leaf1Props}
            stroke="hsl(120, 40%, 45%)"
            fill="hsl(120, 40%, 50%)"
            strokeLinecap="round"
          />
          <AnimatedPath
            animatedProps={leaf2Props}
            stroke="hsl(120, 40%, 45%)"
            fill="hsl(120, 40%, 50%)"
            strokeLinecap="round"
          />
          {outerPetals.map((p, i) => (
            <OuterPetal key={`o${i}`} path={p.path} bloom={bloom} index={i} />
          ))}
          {innerPetals.map((p, i) => (
            <InnerPetal key={`n${i}`} path={p.path} bloom={bloom} index={i} />
          ))}
          <AnimatedCircle
            cx={CX}
            cy={CY}
            fill="hsl(45, 90%, 60%)"
            stroke="hsl(35, 80%, 50%)"
            strokeWidth={2}
            animatedProps={centerProps}
          />
        </Svg>
      </Animated.View>

      <Animated.Text style={[styles.title, textStyle]}>
        Expressions India
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Nurturing Minds, Enriching Lives
      </Animated.Text>

      {/* Swipe-up hint */}
      <RNAnimated.View style={[styles.hint, { opacity: hintOpacity }]}>
        <RNAnimated.Text
          style={[
            styles.hintArrow,
            { transform: [{ translateY: hintBounce }] },
          ]}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.backgroundColor,
  },
  glow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "hsla(4, 74%, 52%, 0.08)",
  },
  title: {
    fontFamily: "Delius_400Regular",
    fontSize: 32,
    color: theme.sectionHeadingColor,
    marginTop: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: theme.font,
    fontSize: 14,
    color: theme.text,
    marginTop: 8,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  hint: {
    position: "absolute",
    bottom: 52,
    alignItems: "center",
    gap: 2,
  },
  hintArrow: {
    fontSize: 20,
    color: theme.sectionHeadingColor,
    opacity: 0.7,
  },
  hintText: {
    fontFamily: theme.font,
    fontSize: 12,
    color: theme.text,
    opacity: 0.5,
    letterSpacing: 0.3,
  },
});
