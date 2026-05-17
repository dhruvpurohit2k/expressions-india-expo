import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { styleFactory } from "../styleFactory";
import { theme } from "../theme";
export default function Director() {
  const globalStyle = styleFactory();
  const screenWidth = Dimensions.get("window").width;
  return (
    <ScrollView
      style={[
        globalStyle.screen,
        { paddingHorizontal: 20, backgroundColor: theme.backgroundColorLight },
      ]}
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          // marginVertical: 20,
          // gap: 10,
        }}
      >
        <View
          style={{
            width: 180,
            height: 230,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/about/director.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              transform: [{ translateY: 10 }],
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{ alignItems: "center", gap: 2 }}>
          <Text
            style={[
              globalStyle.text,
              { textAlign: "center", fontSize: 20, fontFamily: theme.fontBold },
            ]}
          >
            Dr. Jitendra Nagpal
          </Text>
          <Text
            style={[globalStyle.text, { textAlign: "center", fontSize: 15 }]}
          >
            Sr. Consultant Psychiatrist and Incharge
          </Text>
          <Text
            style={[globalStyle.text, { textAlign: "center", fontSize: 14 }]}
          >
            Program Director At{" "}
            <Text style={[globalStyle.companyName]}>Expressions India</Text>
          </Text>
          <Text
            style={[globalStyle.text, { textAlign: "center", fontSize: 14 }]}
          >
            Inst. of Mental Health and Life skills promotion, New Delhi
          </Text>
          <Text
            style={[
              globalStyle.text,
              { textAlign: "center", fontSize: 14, marginTop: 4 },
            ]}
          >
            Mobile : 9810054860
          </Text>
        </View>
      </View>
      <Text
        style={[
          globalStyle.text,
          { marginTop: 30, fontSize: 14, textAlign: "justify" },
        ]}
      >
        Dr. Jitendra Nagpal (MD DNB) is Program Director of Expressions India -
        The National Life Skills, Values, Community and School Wellness Program.
        The Expressions India programme has over 6500 Child and Adolescent
        centred sensitization workshops, training programmes and community
        seminars to its credit. A large number of schooling systems and higher
        education institutions in the country regularly seek technical expertise
        from Expressions India for their advocacy, research, training and
        enrichment. He has been conducted a large number of corporate workshops
        on Work Life Balance.
      </Text>
      <Text
        style={[
          globalStyle.text,
          { fontFamily: theme.font, fontSize: 14, textAlign: "justify" },
        ]}
      >
        Sr. Consultant Psychiatrist and Head of the Instt. of Mental Health and
        Life Skills Promotion and Institute of Child Development and Adolescent
        Health at Moolchand Medcity, New Delhi.
      </Text>
    </ScrollView>
  );
}
