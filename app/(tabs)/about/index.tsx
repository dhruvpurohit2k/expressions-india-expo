import AboutUs from "@/src/components/AboutUs";
import Director from "@/src/components/Director";
import Team from "@/src/components/Team";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function About() {
  const globalStyle = styleFactory();
  const [sectionNumber, setSectionNumber] = useState<number>(0);
  const sectionMap: Record<number, React.JSX.Element> = {
    0: <AboutUs />,
    1: <Director />,
    2: <Team />,
  };
  return (
    <SafeAreaView style={[{ flex: 1 }]} edges={["top"]}>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={[
            globalStyle.stackButton,
            sectionNumber === 0 && {
              backgroundColor: theme.sectionHeadingColor,
            },
          ]}
          onPress={() => setSectionNumber(0)}
        >
          <Text
            style={[
              globalStyle.stackButtonText,
              sectionNumber === 0 && { color: "white" },
            ]}
          >
            ABOUT US
          </Text>
        </Pressable>
        <Pressable
          style={[
            globalStyle.stackButton,
            sectionNumber === 1 && {
              backgroundColor: theme.sectionHeadingColor,
            },
          ]}
          onPress={() => setSectionNumber(1)}
        >
          <Text
            style={[
              globalStyle.stackButtonText,
              sectionNumber === 1 && { color: "white" },
            ]}
          >
            MEET THE DIRECTOR
          </Text>
        </Pressable>
        <Pressable
          style={[
            globalStyle.stackButton,
            sectionNumber === 2 && {
              backgroundColor: theme.sectionHeadingColor,
            },
          ]}
          onPress={() => setSectionNumber(2)}
        >
          <Text
            style={[
              globalStyle.stackButtonText,
              sectionNumber === 2 && { color: "white" },
            ]}
          >
            TEAM
          </Text>
        </Pressable>
      </View>
      {sectionMap[sectionNumber]}
    </SafeAreaView>
  );
  // return <AboutUs />;
}
