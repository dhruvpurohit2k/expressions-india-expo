import { View, Text } from "react-native";
import { styleFactory } from "../styleFactory";
import { Link } from "expo-router";
import Button from "./ui/button";

export default function PastEvents() {
  const globalStyle = styleFactory();
  return (
    <View style={[{ marginTop: 40, marginHorizontal: 20 }]}>
      {/*<Text style={[globalStyle.sectionHeading]}>Past Events</Text>*/}
      <Link href="/event/pastevents" asChild>
        <Button>View Past Events </Button>
      </Link>
      {/*<View style={[globalStyle.container, { gap: 5 }]}>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
        <View style={[{ backgroundColor: "white", padding: 10 }]}></View>
      </View>*/}
    </View>
  );
}
