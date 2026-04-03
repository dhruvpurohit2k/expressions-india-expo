import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useState } from "react";

import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UpcomingEvents from "@/src/components/UpcomingEvent";
import CompletedEvents from "@/src/components/CompletedEvents";
export default function Program() {
  const globalStyle = styleFactory();
  type Tab = "upcoming" | "completed";
  const TABS: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming Events" },
    { key: "completed", label: "Completed Events" },
  ];
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  return (
    <SafeAreaView
      style={{ backgroundColor: theme.backgroundColorLight, flex: 1 }}
      edges={["top"]}
    >
      <Text style={[globalStyle.sectionHeading, { marginHorizontal: 15 }]}>
        Resources
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          marginVertical: 10,
          borderRadius: 10,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.red,
        }}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              backgroundColor:
                activeTab === tab.key ? theme.red : "transparent",
            }}
          >
            <Text
              style={{
                color: activeTab === tab.key ? "white" : theme.red,
                fontFamily: theme.fontBold,
                fontSize: 14,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {activeTab === "upcoming" ? <UpcomingEvents /> : <CompletedEvents />}
      {/*<Animated.ScrollView
        style={[globalStyle.screen, { paddingHorizontal: 10 }]}
      >
        <Animated.View entering={SlideInLeft.duration(700).delay(50)}>
          <UpcomingEvents />
        </Animated.View>
        <Animated.View entering={SlideInDown.duration(700).delay(200)}>
          <PastEvents />
        </Animated.View>
      </Animated.ScrollView>*/}
    </SafeAreaView>
  );
}
