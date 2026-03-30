import Header from "@/src/components/Header";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";

export default function ForYou() {
  const globalStyles = styleFactory();
  return (
    <SafeAreaView
      style={[globalStyles.screen, { paddingHorizontal: 0, margin: 0 }]}
    >
      <Header>
        <Text
          style={{
            color: theme.red,
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
        {options.map((option, index) => {
          return (
            <Animated.View
              key={index}
              entering={FadeInLeft.duration(600).delay(index * 100)}
            >
              <Link href={"/(tabs)/foryou/forStudent"} asChild>
                <Pressable
                  style={(press) => [
                    globalStyles.whoAreYouOption,
                    press && { transform: [{ scale: 0.95 }], opacity: 0.9 },
                  ]}
                >
                  <View style={[globalStyles.whoAreYouOption]}>
                    <View
                      style={[
                        {
                          alignSelf: "flex-start",
                          borderRadius: 300,
                          backgroundColor: "#fecccc",
                          padding: 15,
                        },
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={theme.red}
                      />
                    </View>
                    <Text style={[globalStyles.whoAreYouOptionText]}>
                      {option.text}
                    </Text>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={24}
                      color={theme.red}
                    />
                  </View>
                </Pressable>
              </Link>
            </Animated.View>
          );
        })}
        {/*<Link href={"/(tabs)/foryou/forStudent"} asChild>
          <Pressable>
            <View style={[globalStyles.whoAreYouOption]}>
              <View
                style={[
                  {
                    alignSelf: "flex-start",
                    borderRadius: 300,
                    backgroundColor: "#fecccc",
                    padding: 15,
                  },
                ]}
              >
                <Ionicons name="school-outline" size={24} color={theme.red} />
              </View>
              <Text style={[globalStyles.whoAreYouOptionText]}>STUDENT</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={theme.red}
              />
            </View>
          </Pressable>
        </Link>
        <View style={[globalStyles.whoAreYouOption]}>
          <View
            style={[
              {
                alignSelf: "flex-start",
                borderRadius: 300,
                backgroundColor: "#fecccc",
                padding: 15,
              },
            ]}
          >
            <Ionicons name="book-outline" size={24} color={theme.red} />
          </View>
          <Text style={[globalStyles.whoAreYouOptionText]}>TEACHER</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={theme.red}
          />
        </View>
        <View style={[globalStyles.whoAreYouOption]}>
          <View
            style={[
              {
                alignSelf: "flex-start",
                borderRadius: 300,
                backgroundColor: "#fecccc",
                padding: 15,
              },
            ]}
          >
            <Ionicons name="chatbubbles-outline" size={24} color={theme.red} />
          </View>
          <Text style={[globalStyles.whoAreYouOptionText]}>COUNCELLOR</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={theme.red}
          />
        </View>
        <View style={[globalStyles.whoAreYouOption]}>
          <View
            style={[
              {
                alignSelf: "flex-start",
                borderRadius: 300,
                backgroundColor: "#fecccc",
                padding: 15,
              },
            ]}
          >
            <Ionicons name="people-outline" size={24} color={theme.red} />
          </View>
          <Text style={[globalStyles.whoAreYouOptionText]}>PARENT</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={theme.red}
          />
        </View>
        <View style={[globalStyles.whoAreYouOption]}>
          <View
            style={[
              {
                alignSelf: "flex-start",
                borderRadius: 300,
                backgroundColor: "#fecccc",
                padding: 15,
              },
            ]}
          >
            <Ionicons name="business-outline" size={24} color={theme.red} />
          </View>
          <Text style={[globalStyles.whoAreYouOptionText]}>HEAD OF SCHOOL</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={theme.red}
          />
        </View>*/}
      </View>
    </SafeAreaView>
  );
}

const options = [
  {
    icon: "school-outline",
    text: "SCHOOL",
  },
  {
    icon: "book-outline",
    text: "TEACHER",
  },
  {
    icon: "chatbubbles-outline",
    text: "COUNSELOR",
  },
  {
    icon: "people-outline",
    text: "PARENT",
  },
  {
    icon: "business-outline",
    text: "HEAD OF SCHOOL",
  },
];
