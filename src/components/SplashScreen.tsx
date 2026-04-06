import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  withSpring, // used for text slide
  interpolate,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Circle, G } from "react-native-svg";
import { theme } from "@/src/theme";

const AnimatedG      = Animated.createAnimatedComponent(G);
const AnimatedPath   = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CX = 150;
const CY = 150;

// Distance from SVG view center (150) to stem base (275) — used for sway pivot
const SWAY_OFFSET_Y = 125;

function petalPath(angle: number, innerR: number, outerR: number, spread: number) {
  const rad      = (angle * Math.PI) / 180;
  const radLeft  = ((angle - spread) * Math.PI) / 180;
  const radRight = ((angle + spread) * Math.PI) / 180;
  const x1    = CX + innerR * Math.cos(rad);
  const y1    = CY + innerR * Math.sin(rad);
  const xTip  = CX + outerR * Math.cos(rad);
  const yTip  = CY + outerR * Math.sin(rad);
  const xLeft  = CX + outerR * 0.6 * Math.cos(radLeft);
  const yLeft  = CY + outerR * 0.6 * Math.sin(radLeft);
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

// Wrap each petal in AnimatedG so scale/origin work reliably on Android
function OuterPetal({ path, bloom, index }: { path: string; bloom: Animated.SharedValue<number>; index: number }) {
  const start = (index / OUTER_COUNT) * 0.55;
  const gProps = useAnimatedProps(() => {
    const p = interpolate(bloom.value, [start, start + 0.5], [0, 1], "clamp");
    return { scale: p, originX: CX, originY: CY, opacity: p };
  });
  return (
    <AnimatedG animatedProps={gProps}>
      <Path d={path} fill="hsl(4, 74%, 52%)" stroke="hsl(4, 84%, 35%)" strokeWidth={1.5} />
    </AnimatedG>
  );
}

function InnerPetal({ path, bloom, index }: { path: string; bloom: Animated.SharedValue<number>; index: number }) {
  const start = 0.15 + (index / INNER_COUNT) * 0.45;
  const gProps = useAnimatedProps(() => {
    const p = interpolate(bloom.value, [start, start + 0.5], [0, 1], "clamp");
    return { scale: p, originX: CX, originY: CY, opacity: p };
  });
  return (
    <AnimatedG animatedProps={gProps}>
      <Path d={path} fill="hsl(4, 84%, 42%)" stroke="hsl(4, 70%, 30%)" strokeWidth={1} />
    </AnimatedG>
  );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const stemProgress    = useSharedValue(0);
  const centerScale     = useSharedValue(0);
  const bloom           = useSharedValue(0);
  const swayAngle       = useSharedValue(0);
  const textOpacity     = useSharedValue(0);
  const textY           = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Stem grows
    stemProgress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });

    // 2. Pistil pops in — timing with slight overshoot, no oscillation
    centerScale.value = withDelay(620, withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.8)) }));

    // 3. Petals bloom outward from center, staggered via single bloom 0→1
    bloom.value = withDelay(950, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));

    // 4. Sway — starts after petals are open
    swayAngle.value = withDelay(
      1950,
      withRepeat(
        withSequence(
          withTiming( 5, { duration:  900, easing: Easing.inOut(Easing.sin) }),
          withTiming(-5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming( 0, { duration:  900, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );

    textOpacity.value     = withDelay(1700, withTiming(1, { duration: 600 }));
    textY.value           = withDelay(1700, withSpring(0, { damping: 14, stiffness: 100 }));
    subtitleOpacity.value = withDelay(2200, withTiming(1, { duration: 500 }));

    const t = setTimeout(() => onFinish(), 4000);
    return () => clearTimeout(t);
  }, []);

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
    r:       interpolate(centerScale.value, [0, 1], [0, 12]),
    opacity: centerScale.value,
  }));

  // Sway: rotate the whole SVG around the stem base using View transforms.
  // Stem base is 125px below the SVG center → translateY trick to shift pivot.
  const swayStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY:  SWAY_OFFSET_Y },
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
    <View style={styles.container}>
      <View style={styles.glow} />

      <Animated.View style={swayStyle}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          {/* Stem */}
          <AnimatedPath
            animatedProps={stemProps}
            stroke="hsl(120, 35%, 40%)"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaves */}
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

          {/* Outer petals */}
          {outerPetals.map((p, i) => (
            <OuterPetal key={`o${i}`} path={p.path} bloom={bloom} index={i} />
          ))}

          {/* Inner petals */}
          {innerPetals.map((p, i) => (
            <InnerPetal key={`n${i}`} path={p.path} bloom={bloom} index={i} />
          ))}

          {/* Pistil */}
          <AnimatedCircle
            cx={CX} cy={CY}
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
    </View>
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
});
