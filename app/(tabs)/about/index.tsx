import AboutUs from "@/src/components/AboutUs";
import Director from "@/src/components/Director";
import Team from "@/src/components/Team";
import { NavBar } from "@/src/components/NavBar";
import { styleFactory } from "@/src/styleFactory";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "aboutUs" | "meetDir" | "team";

const TABS: { key: Tab; label: string }[] = [
  { key: "aboutUs", label: "About Us" },
  { key: "meetDir", label: "Meet the Director" },
  { key: "team", label: "Team" },
];

export default function About() {
  const globalStyle = styleFactory();
  const [activeTab, setActiveTab] = useState<Tab>("aboutUs");

  return (
    <SafeAreaView style={[globalStyle.screen]} edges={["top"]}>
      <NavBar
        title="About"
        tabs={TABS}
        currentTab={activeTab}
        currentTabSetter={setActiveTab}
      />
      {activeTab === "aboutUs" && <AboutUs />}
      {activeTab === "meetDir" && <Director />}
      {activeTab === "team" && <Team />}
    </SafeAreaView>
  );
}
