import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import {
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Linking from "expo-linking";
import { latestActivites } from "@/data/home";
import { useState } from "react";
export default function Home() {
  const globalStyle = styleFactory();
  const { width } = useWindowDimensions();
  const buttons = ["Latest Activities", "Brochures", "Media"];
  const [currentView, setCurrentView] = useState(0);
  const LatestNews = (
    <View
      style={{
        marginBottom: 20,
        marginHorizontal: 15,
        // padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: theme.backgroundColorDark,
        borderColor: theme.backgroundColorLight,
        elevation: 2,
        marginVertical: "auto",
      }}
    >
      <BlurView intensity={20}>
        <LinearGradient
          colors={[
            "hsla(000, 0%, 95%,1)",
            "hsla(000, 0%, 95%,1)",
            "hsla(000, 0%, 95%,1)",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0.3, 0.5, 0.9]}
          style={{
            padding: 20,
            margin: 0,
            borderRadius: 10,
          }}
          dither={true}
        >
          <Text style={[globalStyle.sectionHeading]}>Latest Activites</Text>
          {latestActivites.map((item, idx) => (
            <View key={idx} style={{ marginVertical: 5 }}>
              <Pressable
                onPress={() => {
                  Linking.openURL(item.link);
                }}
              >
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.backgroundColorLight,
                    elevation: 1,
                    backgroundColor: theme.backgroundColorLight,
                  }}
                >
                  <Text style={[globalStyle.text]}>{item.title}</Text>
                </View>
              </Pressable>
            </View>
          ))}
        </LinearGradient>
      </BlurView>
    </View>
  );
  const brochures = (
    <View style={{ marginVertical: "auto" }}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={"fast"}
        contentContainerStyle={{ padding: 0 }}
        // style={{ paddingHorizontal: 20 }}
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
      >
        <View
          style={[
            globalStyle.container,
            { width: width - 30, marginHorizontal: 15 },
          ]}
        >
          <Image
            source={require("@/assets/images/home/icdah.png")}
            style={{ marginHorizontal: "auto", width: "85%" }}
            resizeMode="cover"
          />
          <Text style={[globalStyle.text, { textAlign: "center" }]}>
            Center for Child Development & Adolescent Wellbeing (ICDH)
          </Text>
        </View>
        <View
          style={[
            globalStyle.container,
            { width: width - 30, marginHorizontal: 15 },
          ]}
        >
          <Image
            source={require("@/assets/images/home/brochure.png")}
            style={{ marginHorizontal: "auto", width: "85%" }}
            resizeMode="cover"
          />
          <Text style={[globalStyle.text, { textAlign: "center" }]}>
            Brochure:{" "}
            <Text style={globalStyle.companyName}>Expressions India</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
  const media = (
    <View>
      <ScrollView
        // horizontal={true}
        pagingEnabled={true}
        decelerationRate={"fast"}
        contentContainerStyle={{ padding: 0 }}
        style={{ paddingHorizontal: 20 }}
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
      >
        <View
          style={[
            globalStyle.container,
            { width: width - 30, marginHorizontal: 15 },
          ]}
        >
          <Image
            source={require("@/assets/images/home/photogallery.gif")}
            style={{
              marginHorizontal: "auto",
              marginVertical: "auto",
              borderWidth: 4,
              borderColor: "#77aa77",
              width: "85%",
            }}
            resizeMode="cover"
          />
          <Text style={[globalStyle.text, { textAlign: "center" }]}>
            Photo Gallery
          </Text>
        </View>
        <View
          style={[
            globalStyle.container,
            { width: width - 30, marginHorizontal: 15 },
          ]}
        >
          <Image
            source={require("@/assets/images/home/video.png")}
            style={{
              marginHorizontal: "auto",
              marginVertical: "auto",
              borderWidth: 4,
              borderColor: "#77aa77",
              // height: "auto",
              width: "85%",
              // height: "60%",
            }}
            resizeMode="cover"
          />
          <Text style={[globalStyle.text, { textAlign: "center" }]}>
            Videos
          </Text>
        </View>
        <View
          style={[
            globalStyle.container,
            { width: width - 30, marginHorizontal: 15 },
          ]}
        >
          <Image
            source={require("@/assets/images/home/media_image.gif")}
            style={{
              marginHorizontal: "auto",
              marginVertical: "auto",
              borderWidth: 4,
              borderColor: "#77aa77",
              width: "85%",
            }}
            resizeMode="cover"
          />
          <Text style={[globalStyle.text, { textAlign: "center" }]}>Media</Text>
        </View>
      </ScrollView>
    </View>
  );
  const views = [LatestNews, brochures, media];
  return (
    <SafeAreaView
      style={[
        { backgroundColor: theme.backgroundColorDark, flex: 1 },
        // globalStyle.screen,
        // { backgroundColor: theme.backgroundColorLight },
      ]}
      edges={["top", "left", "right"]}
    >
      <Text
        style={[
          globalStyle.companyName,
          {
            fontSize: 30,
            fontFamily: "Inter_700Bold",
            paddingHorizontal: 10,
            paddingVertical: 30,
            marginVertical: 20,
          },
        ]}
      >
        Expressions India
      </Text>
      <ScrollView
        style={{ margin: 0, flex: 1 }}
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
        contentContainerStyle={{ padding: 0 }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            width: width - 20,
            marginHorizontal: 10,
            marginBottom: 50,
            justifyContent: "space-around",
          }}
        >
          {buttons.map((button, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setCurrentView(index);
              }}
              style={[
                {
                  backgroundColor: theme.sectionHeadingColor,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderRadius: 10,
                  flex: 1,
                },
                index === currentView ? { backgroundColor: "white" } : null,
              ]}
            >
              <View>
                <Text
                  style={[
                    globalStyle.text,
                    {
                      color: "white",
                      fontFamily: "Inter_700Bold ",
                      textAlign: "center",
                      textAlignVertical: "center",
                    },
                    index === currentView
                      ? { color: theme.sectionHeadingColor }
                      : null,
                  ]}
                >
                  {button}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        {views[currentView]}
        {/* <View>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            decelerationRate={"fast"}
            contentContainerStyle={{ padding: 0 }}
            // style={{ paddingHorizontal: 20 }}
            contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <View
              style={[
                globalStyle.container,
                { width: width - 30, marginHorizontal: 15 },
              ]}
            >
              <Image
                source={require("@/assets/images/home/journal_image.png")}
                style={{ marginHorizontal: "auto", width: "85%" }}
                resizeMode="cover"
              />
              <Text style={[globalStyle.text, { textAlign: "center" }]}>
                Indian Journal of School Health & Wellbeing
              </Text>
            </View>
            <View
              style={[
                globalStyle.container,
                { width: width - 30, marginHorizontal: 15 },
              ]}
            >
              <Image
                source={require("@/assets/images/home/almanac_image.png")}
                style={{ marginHorizontal: "auto", width: "85%" }}
                resizeMode="cover"
              />
              <Text style={[globalStyle.text, { textAlign: "center" }]}>
                Almanac 2026
              </Text>
            </View>
          </ScrollView>
        </View>*/}
      </ScrollView>
    </SafeAreaView>
  );
}
