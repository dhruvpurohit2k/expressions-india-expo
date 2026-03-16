import { styleFactory } from "@/src/styleFactory";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WriteToUs() {
  const globalStyle = styleFactory();
  return (
    <SafeAreaView style={globalStyle.screen}>
      <ScrollView>
        <Text style={}>Write To Us</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
