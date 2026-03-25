import Header from "@/src/components/Header";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForYou() {
  const globalStyles = styleFactory();
  return (
    <SafeAreaView
      style={[globalStyles.screen, { paddingHorizontal: 0, margin: 0 }]}
    >
      <Header>
        <Text
          style={{
            backgroundColor: theme.sectionHeadingColor,
            color: "white",
            fontSize: 30,
            paddingHorizontal: 15,
            fontFamily: "Inter_700Bold",
          }}
        >
          Who are you ?{" "}
        </Text>
      </Header>
      <View
        style={[
          { alignItems: "center", flex: 1, justifyContent: "center", gap: 20 },
        ]}
      >
        <Link href={"/(tabs)/foryou/forStudent"} asChild>
          <Pressable>
            <View style={[globalStyles.whoAreYouOption]}>
              <Text style={[globalStyles.whoAreYouOptionText]}>STUDENT</Text>
            </View>
          </Pressable>
        </Link>
        <View style={[globalStyles.whoAreYouOption]}>
          <Text style={[globalStyles.whoAreYouOptionText]}>TEACHER</Text>
        </View>
        <View style={[globalStyles.whoAreYouOption]}>
          <Text style={[globalStyles.whoAreYouOptionText]}>COUNCELLOR</Text>
        </View>
        <View style={[globalStyles.whoAreYouOption]}>
          <Text style={[globalStyles.whoAreYouOptionText]}>PARENT</Text>
        </View>
        <View style={[globalStyles.whoAreYouOption]}>
          <Text style={[globalStyles.whoAreYouOptionText]}>HEAD OF SCHOOL</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
