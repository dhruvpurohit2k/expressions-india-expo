import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import AnimatedDots from "./AnimatedDots";

const globalStyle = styleFactory();
const screenWidth = Dimensions.get("window").width;

export default function AboutUs() {
  const scrollX = useSharedValue(0);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.backgroundColorLight,
      }}
      edges={["top"]}
    >
      <Animated.ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          flex: 1,
          backgroundColor: theme.backgroundColorLight,
          marginTop: 0,
        }}
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
        // style={[{ padding: 0 }]}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={"fast"}
        showsHorizontalScrollIndicator={false}
        onScroll={useAnimatedScrollHandler((event) => {
          scrollX.value = event.contentOffset.x;
        })}
        scrollEventThrottle={16}
      >
        <AboutTheOrg />
        <MissionAndVision />
        <ObjectivesAndFocus />
      </Animated.ScrollView>
      <AnimatedDots scrollX={scrollX} count={3} />
    </SafeAreaView>
  );
}

function AboutTheOrg() {
  const scrollY = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const arrowStyle = useAnimatedStyle(() => {
    const distance = contentHeight.value - layoutHeight.value - scrollY.value;
    const opacity = interpolate(distance, [0, 50], [0, 1], "clamp");
    return {
      opacity,
      transform: [{ translateY: withSpring(opacity === 0 ? 20 : 0) }],
    };
  });
  return (
    <View style={[globalStyle.aboutCard, { width: screenWidth - 30 }]}>
      <Animated.ScrollView
        contentInset={{ top: 0, bottom: 0, right: 0, left: 0 }}
        style={{
          backgroundColor: theme.backgroundColorLight,
          paddingHorizontal: 10,
        }}
        onScroll={useAnimatedScrollHandler((event) => {
          scrollY.value = event.contentOffset.y;
          contentHeight.value = event.contentSize.height;
          layoutHeight.value = event.layoutMeasurement.height;
        })}
        onLayout={(event) => {
          layoutHeight.value = event.nativeEvent.layout.height;
        }}
        onContentSizeChange={(width, height) => {
          contentHeight.value = height;
        }}
        scrollEventThrottle={16}
      >
        <Text style={globalStyle.sectionHeading}>Who are we ? </Text>
        <Text style={globalStyle.text}>
          It is now widely acclaimed that Life Skills play a dynamic role in
          overall future capacities of every student. Mental Health Awareness
          and Wellbeing should be included as part of general education through
          the complete span of schooling years. The focus is on evolving good
          practices in schools for overall personality and resilience
          development, with intensive participation in behavioral safety,
          hygiene, gender sensitivity, healthy cyber and social media habits. It
          has also been noted that schools are the key forums for acquisition of
          life long behavioral health knowledge, attitudes and Skills through
          Peer learning and Leadership Training.
        </Text>
        <Image
          source={require("@/assets/images/about/about_us.jpg")}
          style={{ width: screenWidth - 100, marginHorizontal: "auto" }}
          resizeMode="contain"
        />
        <Text style={globalStyle.text}>
          <Text style={globalStyle.companyName}>Expressions India</Text> - The
          National Life Skills and School Wellness Program is a well-recognized
          and awarded initiative by the government and non governmental
          organizations in the country. This program strives to empower, support
          and streamline the co-scholastic and allied elements to effectively
          promote Child and Adolescent Life Skills and Wellbeing Culture in an
          inclusive student led environment for Indian Schools. Having been the
          technical support for the CBSE Adolescent Life Skills Leadership
          Program with focus on building the teachers and students as Well Being
          Ambassadors across the country, a technical resource pool of erudite
          professionals is effectively functional to facilitate these innovative
          programs.
        </Text>
        <Text style={globalStyle.text}>
          The need for a continued dialogue and educational intervention in
          pursuit of empowering the adolescents of our country as Life Skills
          and Well-Being Ambassadors has been strongly felt. When adolescents
          acquire knowledge, values and life skills, they benefit in a variety
          of ways. These qualities help them to make informed decisions, solve
          problems, think critically and creatively, communicate effectively,
          build healthy relationships, empathize with others and cope with and
          manage their lives in a healthy, safe and productive manner.{" "}
          <Text style={globalStyle.companyName}>Expressions India</Text> has
          taken the key technical role in furthering the cause of Health and
          Behavioral change with the Life skills approach and empowered learning
          in schools.
        </Text>
      </Animated.ScrollView>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 10,
            alignSelf: "center",
          },
          arrowStyle,
        ]}
      >
        <Ionicons
          name="chevron-down-circle-sharp"
          size={30}
          color="#888888dd"
        />
      </Animated.View>
    </View>
  );
}

function MissionAndVision() {
  return (
    <View style={[globalStyle.aboutCard, { width: screenWidth - 30 }]}>
      <Text style={globalStyle.sectionHeading}>Mission And Vision</Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyle.text}>1.</Text>
            <Text style={[globalStyle.text, { flex: 1 }]}>
              Towards Healthy, Happy and Harmonious Children of India.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyle.text}>2.</Text>
            <Text style={[globalStyle.text, { flex: 1 }]}>
              Towards Aware, Responsible and Empowered Adolescents and Youth of
              India.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyle.text}>3.</Text>
            <Text style={[globalStyle.text, { flex: 1 }]}>
              To bring together a large number of schools to have a face-to-face
              dialogue through various events, envisaging sustainable models of
              promoting the life skills and well-being programs in schools
              across the country.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyle.text}>4.</Text>
            <Text style={[globalStyle.text, { flex: 1 }]}>
              Make the most of our human talent and potential.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyle.text}>5.</Text>
            <Text style={[globalStyle.text, { flex: 1 }]}>
              Inform, educate, and inspire students and adolescents to reach
              their goals.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyle.text}>6.</Text>
            <Text style={[globalStyle.text, { flex: 1 }]}>
              Create a positive environment that both challenges and supports
              people; and accomplish our goals faster and easier, with less
              stress and more enjoyment.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function ObjectivesAndFocus() {
  return (
    <View
      style={[
        globalStyle.aboutCard,
        {
          width: screenWidth - 30,
        },
      ]}
    >
      <Text style={globalStyle.sectionHeading}>Objectives & Focus Areas</Text>
      <ScrollView
        style={{
          paddingHorizontal: 10,
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={[globalStyle.text]}>1.</Text>
          <Text style={[globalStyle.text, { flex: 1 }]}>
            Student enrichment through best practices of Skills based Adolescent
            Life Skills, Mental Health, Safety and Wellbeing in Schools.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={globalStyle.text}>2.</Text>
          <Text style={[globalStyle.text, { flex: 1 }]}>
            To ensure integration of School Safety, Nutrition and General Health
            concerns within the comprehensive school health curriculum along
            with contemporary gender issues.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={globalStyle.text}>3.</Text>
          <Text style={[globalStyle.text, { flex: 1 }]}>
            To strengthen the peer to peer dialogue and school family
            partnership for promoting Life Skills, Mental Health and Wellbeing
            in Schools.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={globalStyle.text}>4.</Text>
          <Text style={[globalStyle.text, { flex: 1 }]}>
            Voicing the {" student's "} psychosocial needs, fostering effective
            Young Leadership as Life Skills and Wellbeing Ambassadors.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={globalStyle.text}>5.</Text>
          <Text style={[globalStyle.text, { flex: 1 }]}>
            Strengthen Capacity of Implementing Agencies for Project Management.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={globalStyle.text}>6.</Text>
          <Text style={[globalStyle.text, { flex: 1 }]}>
            Youth Mental Health and University/College Counseling Services in
            India.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
