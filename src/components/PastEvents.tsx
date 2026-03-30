import { View, Text, Pressable } from "react-native";
import { styleFactory } from "../styleFactory";
import { router } from "expo-router";
import Button from "./ui/button";
import { History } from "lucide-react-native";
import React from "react";
import { theme } from "../theme";

export default function PastEvents() {
  const globalStyle = styleFactory();
  return (
    <View style={[{ marginTop: 40, marginHorizontal: 20 }]}>
      {/*<Text style={[globalStyle.sectionHeading]}>Past Events</Text>*/}
      <Pressable
        onPress={() => router.push("/event/pastevents")}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.red,
            alignSelf: "flex-start",
            padding: 10,
            borderRadius: 10,
          },
          pressed && {
            opacity: 0.9,
            transform: [{ scale: 0.95 }],
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 16 }}>View Past Events</Text>
        <History
          size={20}
          style={{ marginLeft: 8 }}
          color={"white"}
          strokeWidth={2}
        />
      </Pressable>
      {/*<View style={[globalStyle.container, { gap: 5 }]}>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
      </View>*/}
    </View>
  );
}
