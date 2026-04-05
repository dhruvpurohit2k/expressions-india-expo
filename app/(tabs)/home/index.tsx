import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import LatestEvents from "@/src/components/LatestEvents";
import Carousel from "@/src/components/Carousel";
import { useQuery } from "@tanstack/react-query";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ExternalLink } from "lucide-react-native";

export default function Home() {
  const globalStyle = styleFactory();
  const { data: images = [], isPending: homePageImagesPending } =
    useHomePageImageQuery();

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.backgroundColor, flex: 1 }}
      edges={["top", "left", "right"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Delius_400Regular",
              fontSize: 30,
              color: theme.sectionHeadingColor,
            }}
          >
            Expressions India
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              color: "hsl(0,0%,55%)",
              marginTop: 2,
            }}
          >
            National Life Skills & School Wellness Program
          </Text>
        </Animated.View>

        {/* Carousel */}
        {homePageImagesPending ? (
          <View
            style={{
              height: 260,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 15,
              borderRadius: 20,
              backgroundColor: theme.backgroundColorDark,
            }}
          >
            <ActivityIndicator size="large" color={theme.red} />
          </View>
        ) : (
          <Carousel images={images} />
        )}

        {/* Latest Activities */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <LatestEvents />
        </Animated.View>

        {/* Downloads */}
        <View
          style={{
            paddingHorizontal: 15,
            marginTop: 24,
            marginBottom: 24,
            gap: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <View
              style={{
                width: 4,
                height: 22,
                backgroundColor: theme.red,
                borderRadius: 2,
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: theme.fontBold,
                color: theme.sectionHeadingColor,
              }}
            >
              Downloads
            </Text>
          </View>

          <DownloadCard
            title="Almanac 2026"
            description="Our 2026 Almanac featuring programs, development trainings, and national & global outcomes for child-centric pedagogy."
            image={require("@/assets/images/home/almanac_image.png")}
            imageMode="contain"
            url="https://expressionsindia.org/images/almanac_2026.pdf"
            delay={0}
          />

          <DownloadCard
            title="Brochure"
            description="An overview of our initiatives, events, and the impact we create across schools nationwide."
            image={require("@/assets/images/home/brochure.png")}
            imageMode="cover"
            url="https://expressionsindia.org/images/home/brochure.pdf"
            delay={80}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DownloadCard({
  title,
  description,
  image,
  imageMode,
  url,
  delay,
}: {
  title: string;
  description: string;
  image: any;
  imageMode: "contain" | "cover";
  url: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(450).delay(200 + delay)}>
      <Pressable
        onPress={() => Linking.openURL(url)}
        style={({ pressed }) => [
          {
            backgroundColor: theme.backgroundColorLight,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          },
          pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
        ]}
      >
        <Image
          source={image}
          style={{ width: "100%", height: 180 }}
          resizeMode={imageMode}
        />
        <View
          style={{
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: theme.fontBold,
                fontSize: 16,
                color: theme.sectionHeadingColor,
                marginBottom: 4,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: theme.font,
                fontSize: 13,
                color: "hsl(0,0%,50%)",
                lineHeight: 18,
              }}
            >
              {description}
            </Text>
          </View>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ExternalLink size={18} color={theme.red} strokeWidth={2} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const fetchHomePageImages = async () => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/home/images`,
    );
    const data = await response.json();
    return data as string[];
  } catch (error) {}
};

const useHomePageImageQuery = () => {
  return useQuery({
    queryKey: ["homeImages"],
    queryFn: fetchHomePageImages,
    retry: 3,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  });
};
