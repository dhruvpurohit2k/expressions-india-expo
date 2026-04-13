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
import RecentFeed from "@/src/components/RecentFeed";
import Carousel from "@/src/components/Carousel";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ExternalLink } from "lucide-react-native";
import { useUpcomingCarouselImages } from "@/src/hooks/useUpcomingCarouselImages";
import { useCompletedCarouselImages } from "@/src/hooks/useCompletedCarouselImages";
import { useIsFocused } from "@react-navigation/native";

const lightRed = "hsl(4, 65%, 50%)";

export default function Home() {
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const { data: upcomingImages = [], isPending: upcomingPending } =
    useUpcomingCarouselImages({ enabled: isFocused });
  const { data: completedImages = [], isPending: completedPending } =
    useCompletedCarouselImages({ enabled: isFocused });

  return (
    <SafeAreaView style={[globalStyle.screen]} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text
            style={{
              fontSize: 30,
              color: "rgb(225,0,0)",
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            Expressions India
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              textAlign: "center",
              color: "hsl(0,0%,55%)",
              marginTop: 2,
            }}
          >
            National Life Skills & School Wellness Program
          </Text>
        </Animated.View>

        {/* Upcoming Events Carousel */}
        {upcomingPending ? (
          <>
            <SectionTitle label="Upcoming Events" />
            <CarouselPlaceholder />
          </>
        ) : upcomingImages.length > 0 ? (
          <>
            <SectionTitle label="Upcoming Events" />
            <Carousel images={upcomingImages} />
          </>
        ) : null}

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <RecentFeed />
        </Animated.View>
        {/* Completed Events Carousel */}
        {completedPending ? (
          <>
            <SectionTitle label="Completed Events" />
            <CarouselPlaceholder />
          </>
        ) : completedImages.length > 0 ? (
          <>
            <SectionTitle label="Recent Events" />
            <Carousel images={completedImages} />
          </>
        ) : null}

        {/* Downloads */}
        <View
          style={{
            paddingHorizontal: 15,
            marginTop: 24,
            marginBottom: 24,
            gap: 14,
          }}
        >
          <SectionTitle label="Downloads" />

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

function SectionTitle({ label }: { label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 15,
        marginTop: 24,
        marginBottom: 4,
      }}
    >
      <View
        style={{
          width: 4,
          height: 22,
          backgroundColor: lightRed,
          borderRadius: 2,
        }}
      />
      <Text
        style={{
          fontSize: 20,
          fontFamily: theme.fontBold,
          color: lightRed,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function CarouselPlaceholder() {
  return (
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
            backgroundColor: theme.backgroundColor,
            borderRadius: 16,
            padding: 10,
            overflow: "hidden",
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
                color: lightRed,
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
            <ExternalLink size={18} color={lightRed} strokeWidth={2} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
