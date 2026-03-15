import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { styleFactory } from "../styleFactory";
import { theme } from "../theme";
export default function Director() {
  const globalStyle = styleFactory();
  const screenWidth = Dimensions.get("window").width;
  return (
    <ScrollView style={globalStyle.screen}>
      <View
        style={[
          globalStyle.container,
          { marginHorizontal: 0, paddingHorizontal: 10 },
          { backgroundColor: theme.backgroundColorLight, elevation: 5 },
        ]}
      >
        <Text style={[globalStyle.sectionHeading]}>DIRECTOR</Text>
        <View
          style={{
            flexDirection: "row",
            width: screenWidth - 60,
            // elevation: 5,
            backgroundColor: theme.backgroundColorLight,
            borderRadius: 10,
            // padding: 10,
            // marginHorizontal: 20,
            gap: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              // padding: 10,
            }}
          >
            <Text style={[globalStyle.text]}>Dr. Jitendra Nagpal</Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Sr. Consultant Psychiatrist and Incharge
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Program Director At{" "}
              <Text style={[globalStyle.companyName]}>Expressions India</Text>
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Inst. of Mental Health and Life skills promotion, New Delhi
            </Text>
            <Text
              style={[globalStyle.text, { textAlign: "left", fontSize: 14 }]}
            >
              Mobile : 9810054860
            </Text>
          </View>
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              elevation: 10,
              marginLeft: "auto",
              backgroundColor: theme.backgroundColorLight,
              borderRadius: 10,
              // width: "40%",
            }}
          >
            <Image
              source={require("@/assets/images/about/director.jpg")}
              style={{
                borderRadius: 10,
                // aspectRatio: 1,
                // backgroundColor: "black",
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={[globalStyle.text, { marginTop: 30 }]}>
          Dr. Jitendra Nagpal (MD DNB) is Program Director of Expressions India
          - The National Life Skills, Values, Community and School Wellness
          Program. The Expressions India programme has over 6500 Child and
          Adolescent centred sensitization workshops, training programmes and
          community seminars to its credit. A large number of schooling systems
          and higher education institutions in the country regularly seek
          technical expertise from Expressions India for their advocacy,
          research, training and enrichment. He has been conducted a large
          number of corporate workshops on Work Life Balance.
        </Text>
        <Text style={[globalStyle.text, { marginTop: 10 }]}>
          Also, He is{" "}
          <Text style={[globalStyle.text, { fontFamily: theme.fontBold }]}>
            Sr. Consultant Psychiatrist{" "}
          </Text>
          <Text style={[globalStyle.text, { fontFamily: theme.fontBold }]}>
            Sr. Consultant Psychiatrist and Head of the Instt. of Mental Health
            and Life Skills Promotion and Institute of Child Development and
            Adolescent Health at Moolchand Medcity, New Delhi.
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
