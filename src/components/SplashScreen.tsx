import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Path, Circle, G } from "react-native-svg";
import { theme } from "@/src/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const { width, height } = Dimensions.get("window");
const CX = 150;
const CY = 150;

interface SplashScreenProps {
  onFinish: () => void;
}

// Petal path generator - creates a teardrop/petal shape at a given angle
function petalPath(angle: number, innerR: number, outerR: number, spread: number): string {
  const rad = (angle * Math.PI) / 180;
  const radLeft = ((angle - spread) * Math.PI) / 180;
  const radRight = ((angle + spread) * Math.PI) / 180;

  const x1 = CX + innerR * Math.cos(rad);
  const y1 = CY + innerR * Math.sin(rad);

  const xTip = CX + outerR * Math.cos(rad);
  const yTip = CY + outerR * Math.sin(rad);

  const xLeft = CX + (outerR * 0.6) * Math.cos(radLeft);
  const yLeft = CY + (outerR * 0.6) * Math.sin(radLeft);

  const xRight = CX + (outerR * 0.6) * Math.cos(radRight);
  const yRight = CY + (outerR * 0.6) * Math.sin(radRight);

  return `M ${x1} ${y1} Q ${xLeft} ${yLeft} ${xTip} ${yTip} Q ${xRight} ${yRight} ${x1} ${y1} Z`;
}

const PETAL_COUNT = 8;
const INNER_PETAL_COUNT = 6;

const outerPetals = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  angle: (360 / PETAL_COUNT) * i - 90,
  path: petalPath((360 / PETAL_COUNT) * i - 90, 8, 70, 18),
  color: "hsl(4, 74%, 52%)",
}));

const innerPetals = Array.from({ length: INNER_PETAL_COUNT }, (_, i) => ({
  angle: (360 / INNER_PETAL_COUNT) * i - 60,
  path: petalPath((360 / INNER_PETAL_COUNT) * i - 60, 6, 45, 22),
  color: "hsl(4, 84%, 42%)",
}));

function Petal({
  path,
  color,
  delay,
  bloom,
}: {
  path: string;
  color: string;
  delay: number;
  bloom: Animated.SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => {
    const scale = interpolate(bloom.value, [0, 1], [0, 1]);
    return {
      opacity: interpolate(bloom.value, [0, 0.3, 1], [0, 0.8, 1]),
      strokeWidth: interpolate(bloom.value, [0, 1], [0, 1.5]),
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withDelay(delay, withSpring(bloom.value, { damping: 8, stiffness: 80 })) },
      ],
    };
  });

  return (
    <AnimatedPath
      d={path}
      fill={color}
      stroke="hsl(4, 84%, 35%)"
      animatedProps={animatedProps}
    />
  );
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const bloom = useSharedValue(0);
  const centerScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const wholeScale = useSharedValue(0.8);
  const stemHeight = useSharedValue(0);

  useEffect(() => {
    // Stem grows
    stemHeight.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });

    // Flower blooms
    bloom.value = withDelay(400, withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }));

    // Center circle pops in
    centerScale.value = withDelay(900, withSpring(1, { damping: 6, stiffness: 100 }));

    // Whole flower settles
    wholeScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }));

    // Text appears
    textOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(1200, withSpring(0, { damping: 12, stiffness: 100 }));

    // Subtitle
    subtitleOpacity.value = withDelay(1600, withTiming(1, { duration: 500 }));

    // Finish after hold
    const timeout = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => clearTimeout(timeout);
  }, []);

  const flowerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wholeScale.value }],
  }));

  const stemProps = useAnimatedProps(() => {
    const h = interpolate(stemHeight.value, [0, 1], [0, 60]);
    return {
      d: `M ${CX} ${CY + 65} Q ${CX + 5} ${CY + 65 + h * 0.5} ${CX} ${CY + 65 + h}`,
      strokeWidth: interpolate(stemHeight.value, [0, 1], [0, 3]),
      opacity: stemHeight.value,
    };
  });

  const leaf1Props = useAnimatedProps(() => {
    const progress = interpolate(stemHeight.value, [0.4, 1], [0, 1], "clamp");
    return {
      d: `M ${CX} ${CY + 95} Q ${CX - 25} ${CY + 80} ${CX - 20} ${CY + 92}`,
      strokeWidth: 2,
      opacity: progress,
    };
  });

  const leaf2Props = useAnimatedProps(() => {
    const progress = interpolate(stemHeight.value, [0.5, 1], [0, 1], "clamp");
    return {
      d: `M ${CX} ${CY + 105} Q ${CX + 25} ${CY + 90} ${CX + 22} ${CY + 102}`,
      strokeWidth: 2,
      opacity: progress,
    };
  });

  const centerProps = useAnimatedProps(() => ({
    r: interpolate(centerScale.value, [0, 1], [0, 12]),
    opacity: centerScale.value,
  }));

  const outerPetalProps = outerPetals.map((_, i) =>
    useAnimatedProps(() => {
      const stagger = i * 60;
      const progress = interpolate(
        bloom.value,
        [0, 0.3, 1],
        [0, 0, 1],
      );
      return {
        opacity: progress,
        strokeWidth: interpolate(progress, [0, 1], [0, 1]),
      };
    })
  );

  const outerPetalStyles = outerPetals.map((_, i) =>
    useAnimatedStyle(() => {
      const stagger = i * 60;
      return {
        transform: [
          {
            scale: withDelay(
              stagger,
              withSpring(bloom.value, { damping: 8, stiffness: 80 })
            ),
          },
        ],
      };
    })
  );

  const innerPetalProps = innerPetals.map((_, i) =>
    useAnimatedProps(() => {
      const progress = interpolate(bloom.value, [0.2, 0.6, 1], [0, 0, 1]);
      return {
        opacity: progress,
        strokeWidth: interpolate(progress, [0, 1], [0, 1]),
      };
    })
  );

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Soft radial glow behind flower */}
      <Animated.View style={[styles.glow, flowerStyle]} />

      <Animated.View style={flowerStyle}>
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
          {outerPetals.map((petal, i) => (
            <AnimatedPath
              key={`outer-${i}`}
              d={petal.path}
              fill={petal.color}
              stroke="hsl(4, 84%, 35%)"
              animatedProps={outerPetalProps[i]}
            />
          ))}

          {/* Inner petals */}
          {innerPetals.map((petal, i) => (
            <AnimatedPath
              key={`inner-${i}`}
              d={petal.path}
              fill={petal.color}
              stroke="hsl(4, 70%, 30%)"
              animatedProps={innerPetalProps[i]}
            />
          ))}

          {/* Center */}
          <AnimatedCircle
            cx={CX}
            cy={CY}
            fill="hsl(45, 90%, 60%)"
            stroke="hsl(35, 80%, 50%)"
            strokeWidth={2}
            animatedProps={centerProps}
          />

          {/* Center detail dots */}
          <AnimatedCircle
            cx={CX - 3}
            cy={CY - 2}
            fill="hsl(35, 80%, 45%)"
            animatedProps={useAnimatedProps(() => ({
              r: interpolate(centerScale.value, [0, 1], [0, 2]),
              opacity: centerScale.value,
            }))}
          />
          <AnimatedCircle
            cx={CX + 3}
            cy={CY + 2}
            fill="hsl(35, 80%, 45%)"
            animatedProps={useAnimatedProps(() => ({
              r: interpolate(centerScale.value, [0, 1], [0, 2]),
              opacity: centerScale.value,
            }))}
          />
          <AnimatedCircle
            cx={CX + 1}
            cy={CY - 4}
            fill="hsl(35, 80%, 45%)"
            animatedProps={useAnimatedProps(() => ({
              r: interpolate(centerScale.value, [0, 1], [0, 1.5]),
              opacity: centerScale.value,
            }))}
          />
        </Svg>
      </Animated.View>

      {/* Title text */}
      <Animated.Text style={[styles.title, textStyle]}>
        Expressions India
      </Animated.Text>

      {/* Subtle tagline */}
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
