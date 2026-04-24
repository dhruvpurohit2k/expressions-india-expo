import { Pressable, Text } from "react-native";
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
        backgroundColor: theme.red,
        paddingHorizontal: 15,
        paddingTop: insets.top + 10,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Animated.Text
        entering={slideInFromTop}
        style={{
          marginHorizontal: 5,
          marginBottom: 10,
          fontSize: 38,
          color: "white",
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
          padding: 5,
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
  const scale = useSharedValue(isActive ? 1 : 0.9);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1 : 0.9, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            // alignText: "center",
            borderRadius: 5,
            // height: "100%",
            backgroundColor: isActive ? "white" : "transparent",
            borderWidth: 1,
            borderColor: isActive ? "white" : "rgba(255,255,255,0.35)",
            // elevation: isActive ? 5 : 0,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={{
            color: isActive ? theme.red : "rgba(255,255,255,0.8)",
            fontFamily: theme.fontBold,
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 14,
          }}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
