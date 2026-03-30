import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable } from "react-native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import Header from "@/src/components/Header";
import Button from "@/src/components/ui/button";
export default function Contact() {
  const globalStyle = styleFactory();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}
    >
      <ScrollView>
        <Header>
          <Text
            style={[
              {
                color: theme.red,
                paddingHorizontal: 20,
                fontFamily: theme.fontBold,
                fontSize: 30,
              },
            ]}
          >
            Contact Us
          </Text>
        </Header>
        <View style={globalStyle.container}>
          <Text style={[globalStyle.sectionHeading, globalStyle.companyName]}>
            Expressions India
          </Text>
          <Text
            style={[globalStyle.text, { marginVertical: 0, marginBottom: 15 }]}
          >
            The Life Skills & National School Mental Health Program
          </Text>
          <Text style={[globalStyle.text, { fontFamily: theme.fontBold }]}>
            Dr. Jitendra Nagpal, M.D, D.N.B
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 0 }]}>
            Program Director at{" "}
            <Text style={globalStyle.companyName}>Expressions India,</Text>
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 0 }]}>
            Sr. Consultant Psychiatrist and Head
          </Text>
          <Text
            style={[globalStyle.text, { marginVertical: 0, marginTop: 20 }]}
          >
            Moolchand Medicity
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 0 }]}>
            Lajpat Nagar, New Delhi
          </Text>
          <Text
            style={[
              globalStyle.text,
              { fontFamily: theme.fontBold, marginTop: 20 },
            ]}
          >
            Email
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 2 }]}>
            jnagpal10@gmail.com{" "}
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 2 }]}>
            contactexpressions.india@gmail.com
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 2 }]}>
            expressionsindia2005@gmail.com
          </Text>
          <Text
            style={[
              globalStyle.text,
              { fontFamily: theme.fontBold, marginTop: 20, fontSize: 14 },
            ]}
          >
            For queries regarding the Indian Journal of School Health &
            Wellbeing
          </Text>
          <Text style={[globalStyle.text, { marginVertical: 5 }]}>
            journal@expressionsindia.org
          </Text>
          <Text
            style={[
              globalStyle.text,
              { fontFamily: theme.fontBold, marginTop: 20 },
            ]}
          >
            Mobile
          </Text>
          <View style={{ gap: 0 }}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[globalStyle.text, { marginVertical: 0 }]}>
                +91 93112 75888
              </Text>
              <Text style={[globalStyle.text, { marginVertical: 0 }]}>
                +91 95608 80038
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={[globalStyle.text, { marginVertical: 0 }]}>
                +91 98100 54860
              </Text>
              <Text style={[globalStyle.text, { marginVertical: 0 }]}>
                +91 93100 86792
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={[globalStyle.text, { marginVertical: 0 }]}>
                +91 9560880038
              </Text>
              <Text style={[globalStyle.text, { marginVertical: 0 }]}>
                +91 9810054860
              </Text>
            </View>
            <Text style={[globalStyle.text, { marginVertical: 0 }]}>
              +91 7835922093
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Linking.openURL(
                "https://www.facebook.com/Expressions-India-Healthy-Schools-Healthy-India-149959487891/?ref=settings",
              );
            }}
          >
            <Text
              style={[
                globalStyle.text,
                {
                  color: "blue",
                  textDecorationLine: "underline",
                  marginTop: 30,
                  marginBottom: 0,
                },
              ]}
            >
              Facebook
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Linking.openURL(
                "https://www.youtube.com/channel/UCAMRykicei1GOuiT8ac1xXA/videos",
              );
            }}
          >
            <Text
              style={[
                globalStyle.text,
                { color: "blue", textDecorationLine: "underline" },
              ]}
            >
              Youtube
            </Text>
          </Pressable>
        </View>
        <Link href="/contact/writetous" asChild>
          <Button style={{ alignSelf: "center", marginVertical: 10 }}>
            Write To Us
          </Button>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
