import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { styleFactory } from "@/src/styleFactory";
export default function Workshop() {
  const { id } = useLocalSearchParams();
  const globalStyle = styleFactory();
  return (
    <SafeAreaView style={[globalStyle.screen]}>
      <Text>{id}</Text>
    </SafeAreaView>
  );
}
