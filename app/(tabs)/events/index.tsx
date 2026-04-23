import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import UpcomingEvents from "@/src/components/UpcomingEvent";
import CompletedEvents from "@/src/components/CompletedEvents";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NavBar } from "@/src/components/NavBar";

export default function Program() {
  const globalStyle = styleFactory();
  type Tab = "upcoming" | "completed";
  const TABS: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming Events" },
    { key: "completed", label: "Completed Events" },
  ];
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  return (
    <View style={{ backgroundColor: theme.backgroundColorLight, flex: 1 }}>
      <NavBar
        title="Events"
        tabs={TABS}
        currentTab={activeTab}
        currentTabSetter={setActiveTab}
      />
      {activeTab === "upcoming" ? <UpcomingEvents /> : <CompletedEvents />}
    </View>
  );
}
