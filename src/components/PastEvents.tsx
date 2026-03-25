import { View, Text } from "react-native";
import { styleFactory } from "../styleFactory";

export default function PastEvents() {
  const globalStyle = styleFactory();
  return (
    <View style={[]}>
      <Text style={[globalStyle.sectionHeading]}>Past Events</Text>
      <View style={[globalStyle.container, { gap: 5 }]}>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
      </View>
    </View>
  );
}
