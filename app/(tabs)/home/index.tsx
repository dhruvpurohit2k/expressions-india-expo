import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { Link } from "expo-router";
import { Text, View, ScrollView, Image, Pressable } from "react-native";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import LatestActivities from "@/src/components/LatestEvents";
import { EventListItem } from "@/src/types";
import { useState } from "react";
import LatestEvents from "@/src/components/LatestEvents";
import Header from "@/src/components/Header";
import Button from "@/src/components/ui/button";

export default function Home() {
  const globalStyle = styleFactory();

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.backgroundColorLight, flex: 1 }]}
      edges={["top", "left", "right"]}
    >
      <ScrollView>
        <Header>
          <Text
            style={[
              {
                backgroundColor: theme.sectionHeadingColor,
                color: "white",
                paddingHorizontal: 15,
                fontSize: 30,
                fontFamily: "Inter_700Bold",
              },
            ]}
          >
            Expressions India
          </Text>
        </Header>
        <View style={[globalStyle.container]}>
          <Text style={[globalStyle.text, { fontSize: 18 }]}>
            Expressions India is a national initiative empowering students with
            vital life skills, mental health awareness, and emotional resilience
            for a healthier future.
          </Text>
          <Link href="/about" asChild>
            <Button>Know More</Button>
            {/*<Pressable>
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter_700Bold",
                  alignSelf: "flex-start",
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: theme.sectionHeadingColor,
                }}
              >
                Know More
              </Text>
            </Pressable>*/}
          </Link>
        </View>
        <LatestEvents />
        <View style={globalStyle.container}>
          <Text style={globalStyle.sectionHeading}>Almanac 2026</Text>
          <Text style={globalStyle.text}>
            Our 2026 Almanac which features our programs and development
            trainings and outcomes of national and global headlines for
            enrichment of child centric pedagogy, school leadership, and
            training resource enrichment.
          </Text>
          <Pressable
            onPress={() => {
              Linking.openURL(
                "https://expressionsindia.org/images/almanac_2026.pdf",
              );
            }}
          >
            <View
              style={{
                elevation: 5,
                backgroundColor: "black",
                alignSelf: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={require("@/assets/images/home/almanac_image.png")}
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
          </Pressable>
        </View>
        <View style={globalStyle.container}>
          <Text style={globalStyle.sectionHeading}>Brochure</Text>
          <Text style={globalStyle.text}>
            Check out our brochure for more details.
          </Text>
          <Pressable
            onPress={() => {
              Linking.openURL(
                "https://expressionsindia.org/images/home/brochure.pdf",
              );
            }}
          >
            <View
              style={{
                elevation: 5,
                backgroundColor: "black",
                alignSelf: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={require("@/assets/images/home/brochure.png")}
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
