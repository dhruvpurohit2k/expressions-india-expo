import { View, Text, ScrollView, Dimensions } from "react-native";
import { styleFactory } from "../styleFactory";
import { theme } from "../theme";
export default function Team() {
  const globalStyle = styleFactory();
  const screenWidth = Dimensions.get("window").width;
  return (
    <ScrollView style={[globalStyle.screen]}>
      <Text style={[globalStyle.sectionHeading]}>Our Team</Text>
      <Text style={[globalStyle.text]}>
        Over the last thirteen years,{" "}
        <Text style={[globalStyle.companyName]}>Expressions India</Text> has
        collaborated with various school counsellors, teachers, medical
        professionals with the common focus on enhancement of mental health and
        life skills development.
      </Text>
      <Text style={[globalStyle.text]}>
        Over the last thirteen years,{" "}
        <Text style={[globalStyle.companyName]}>Expressions India</Text> has
        collaborated with various school counsellors, teachers, medical
        professionals with the common focus on enhancement of mental health and
        life skills development.
      </Text>
      <Text style={[globalStyle.sectionHeading, { fontSize: 18 }]}>
        Technical Resource Core Group - (Delhi & NCR)
      </Text>
      <View
        style={[
          globalStyle.container,
          {
            backgroundColor: theme.backgroundColorLight,
            elevation: 2,
            borderRadius: 10,
            gap: 20,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#22222299",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Program Director
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. Jitendra Nagpal
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#22222299",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Senior Advisors (Academics & Training)
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Ms. Geeta Mehrotra
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Ms. Aprajita Dixit
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Ms.Nupur Lakhani
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#22222299",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Senior Manager (Office Operations) (Academic & Training Services)
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Ms. Priya Sharma
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#22222299",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[
                globalStyle.text,
                {
                  textAlign: "left",
                  fontSize: 14,
                },
              ]}
            >
              Senior Manager (Office Operations) (Academic & Training Services)
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                globalStyle.text,
                { textAlign: "left", fontSize: 14 },
                { fontFamily: theme.fontBold },
              ]}
            >
              Mysore
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. Rushi
            </Text>
            <Text
              style={[
                globalStyle.text,
                { textAlign: "left", fontSize: 14 },
                { fontFamily: theme.fontBold },
              ]}
            >
              Mathura
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Ms. Rakhi Garg
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Ms. Sainu Garg
            </Text>
            <Text
              style={[
                globalStyle.text,
                { textAlign: "left", fontSize: 14 },
                { fontFamily: theme.fontBold },
              ]}
            >
              Kochi
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. Manoranjini V.
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Technical Advisory Group
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. H. K. Chopra
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. Shiv Chopra
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. Manoj Kumar
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Dr. Sandeep Vohra
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
