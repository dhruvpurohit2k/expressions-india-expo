import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Events from "@/src/components/Events";
import WorkShops from "@/src/components/WorkShops";

export default function Program() {
  const [isEvents, setIsEvents] = useState(true);
  const globalStyle = styleFactory();
  // const screenHeight = Dimensions.get("screen").height;
  // const screenWidth = Dimensions.get("screen").width;
  return (
    <SafeAreaView
      style={{ backgroundColor: theme.backgroundColorLight, flex: 1 }}
      edges={["top"]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Pressable
          style={[
            globalStyle.stackButton,
            isEvents && {
              backgroundColor: theme.sectionHeadingColor,
            },
          ]}
          onPress={() => setIsEvents(true)}
        >
          <Text
            style={[
              globalStyle.stackButtonText,
              isEvents && { color: "white" },
            ]}
          >
            {" "}
            EVENTS
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setIsEvents(false)}
          style={[
            globalStyle.stackButton,
            !isEvents && {
              backgroundColor: theme.sectionHeadingColor,
            },
          ]}
        >
          <Text
            style={[
              globalStyle.stackButtonText,
              !isEvents && { color: "white" },
            ]}
          >
            WORKSHOPS
          </Text>
        </Pressable>
      </View>
      <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 10 }}>
        {isEvents ? <Events /> : <WorkShops />}
      </View>
    </SafeAreaView>
  );
}
