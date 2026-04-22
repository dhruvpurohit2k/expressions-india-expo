import { Pressable } from "react-native";
import Animated, {
  Easing,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const slideInFromTop = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -24 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(320);
import { useEffect } from "react";
import { theme } from "../theme";
import { Text } from "react-native";

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
  return (
    <>
      <Animated.Text
        entering={slideInFromTop}
        style={{
          marginHorizontal: 20,
          // marginHorizontal: "auto",
          marginVertical: 10,
          fontSize: 38,
          // fontFamily: theme.fontBold,
          color: "rgb(225,0,0)",
        }}
      >
        {title}
      </Animated.Text>

      <Animated.View
        entering={slideInFromTop.delay(70)}
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          marginVertical: 10,
          alignItems: "center",
          // borderRadius: 10,
          padding: 5,
          // backgroundColor: "rgb(255,245,245)",
          // backgroundColor: "hsl(0 0% 97%)",
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
    </>
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
            backgroundColor: isActive ? theme.red : "transparent",
            borderWidth: 1,
            borderColor: isActive ? theme.red : "hsl(0 0% 97%)",
            elevation: isActive ? 5 : 0,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={{
            color: isActive ? "white" : "rgb(225, 150,150)",
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
