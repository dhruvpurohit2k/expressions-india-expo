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
  const items = [
    "Towards Healthy, Happy and Harmonious Children of India.",
    "Towards Aware, Responsible and Empowered Adolescents and Youth of India.",
    "To bring together a large number of schools to have a face-to-face dialogue through various events, envisaging sustainable models of promoting the life skills and well-being programs in schools across the country.",
    "Make the most of our human talent and potential.",
    "Inform, educate, and inspire students and adolescents to reach their goals.",
    "Create a positive environment that both challenges and supports people; and accomplish our goals faster and easier, with less stress and more enjoyment.",
  ];
  return (
    <View style={[globalStyle.aboutCard, { width: screenWidth - 30 }]}>
      <Text style={globalStyle.sectionHeading}>Mission And Vision</Text>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {items.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              backgroundColor: theme.backgroundColorLight,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              // elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 14,
                backgroundColor: theme.red + "18",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fontBold,
                  fontSize: 10,
                  color: "white",
                }}
              >
                {i + 1}
              </Text>
            </View>
            <Text
              style={[
                { fontSize: 16, color: theme.text, flex: 1, marginBottom: 0 },
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ObjectivesAndFocus() {
  const items = [
    "Student enrichment through best practices of Skills based Adolescent Life Skills, Mental Health, Safety and Wellbeing in Schools.",
    "To ensure integration of School Safety, Nutrition and General Health concerns within the comprehensive school health curriculum along with contemporary gender issues.",
    "To strengthen the peer to peer dialogue and school family partnership for promoting Life Skills, Mental Health and Wellbeing in Schools.",
    "Voicing the student's psychosocial needs, fostering effective Young Leadership as Life Skills and Wellbeing Ambassadors.",
    "Strengthen Capacity of Implementing Agencies for Project Management.",
    "Youth Mental Health and University/College Counseling Services in India.",
  ];
  return (
    <View style={[globalStyle.aboutCard, { width: screenWidth - 30 }]}>
      <Text style={globalStyle.sectionHeading}>Objectives & Focus Areas</Text>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {items.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              backgroundColor: theme.backgroundColorLight,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              // elevation: 1,
              // shadowColor: "#000",
              // shadowOffset: { width: 0, height: 1 },
              // shadowOpacity: 0.06,
              // shadowRadius: 3,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 14,
                backgroundColor: theme.red + "18",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fontBold,
                  fontSize: 10,
                  color: "white",
                }}
              >
                {i + 1}
              </Text>
            </View>
            <Text
              style={[
                { fontSize: 16, color: theme.text, flex: 1, marginBottom: 0 },
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
