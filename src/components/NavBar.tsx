import { Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../theme";
import { Text } from "react-native";
import { styleFactory } from "../styleFactory";

export function NavBar({
  title,
  tabs,
  currentTab,
  currentTabSetter,
}: NavBarProps) {
  const globalStyle = styleFactory();
  return (
    <>
      <Animated.Text
        entering={FadeInDown.duration(350)}
        style={[
          {
            marginHorizontal: "auto",
            marginVertical: 10,
            fontSize: 32,
            // fontFamily: theme.fontBold,
            color: "rgb(225,0,0)",
          },
        ]}
      >
        {title}
      </Animated.Text>

      <Animated.View
        entering={FadeInDown.duration(350).delay(70)}
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          marginVertical: 10,
          borderRadius: 10,
          overflow: "hidden",
          padding: 5,
          // backgroundColor: theme.red,
          backgroundColor: "rgb(255,245,245)",
          // borderWidth: 1,
          // borderColor: theme.red,
        }}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => currentTabSetter(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              borderRadius: 10,
              elevation: currentTab === tab.key ? 5 : 0,
              backgroundColor:
                currentTab === tab.key ? theme.red : "transparent",
            }}
          >
            <Text
              style={{
                color: currentTab === tab.key ? "white" : theme.red,
                fontFamily: theme.fontBold,
                fontSize: 14,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
}

type NavBarProps = {
  title: string;
  tabs: {
    key: string;
    label: string;
  }[];
  currentTab: string;
  currentTabSetter: any;
};
