import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { theme } from "../theme";

const slideInFromTop = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -24 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(320);

type NavBarProps = {
  title: string;
  tabs: { key: string; label: string }[];
  currentTab: string;
  currentTabSetter: any;
};

export function NavBar({
  title,
  tabs,
  currentTab,
  currentTabSetter,
}: NavBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      entering={slideInFromTop}
      style={{
        backgroundColor: theme.backgroundColorLight,
        paddingHorizontal: 15,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.06)",
      }}
    >
      <Animated.Text
        entering={slideInFromTop}
        style={{
          marginHorizontal: 5,
          marginBottom: 8,
          fontSize: 30,
          color: theme.redMuted,
          fontFamily: theme.fontBold,
        }}
      >
        {title}
      </Animated.Text>

      <Animated.View
        entering={slideInFromTop.delay(70)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "hsl(0,0%,95%)",
          borderRadius: 24,
          padding: 4,
          marginHorizontal: 5,
        }}
      >
        {tabs.map((tab) => (
          <NavBarTab
            key={tab.key}
            tab={tab}
            isActive={currentTab === tab.key}
            onPress={() => currentTabSetter(tab.key)}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

function NavBarTab({
  tab,
  isActive,
  onPress,
}: {
  tab: { key: string; label: string };
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isActive ? 1 : 0.94);
  const pillOpacity = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1 : 0.94, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    pillOpacity.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
  }));

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
          },
          scaleStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 20,
              backgroundColor: theme.backgroundColorLight,
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 2,
            },
            pillStyle,
          ]}
        />
        <Text
          style={{
            color: isActive ? theme.red : "hsl(0,0%,50%)",
            fontFamily: theme.fontBold,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

