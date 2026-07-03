import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import {
  Alert,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import RecentFeed from "@/src/components/RecentFeed";
import Carousel from "@/src/components/Carousel";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ExternalLink } from "lucide-react-native";
import { useUpcomingCarouselImages } from "@/src/hooks/useUpcomingCarouselImages";
import { useCompletedCarouselImages } from "@/src/hooks/useCompletedCarouselImages";
import { useIsFocused  } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAlmanac } from "@/src/api/fetchAlmanac";
import { fetchBrochure } from "@/src/api/fetchBrochure";
import { queryKeys } from "@/src/lib/queryKeys";

const lightRed = "hsl(4, 65%, 56%)";

export default function Home() {
  const globalStyle = styleFactory();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { data: upcomingImages = [], isPending: upcomingPending } =
    useUpcomingCarouselImages({ enabled: isFocused });
  const { data: completedImages = [], isPending: completedPending } =
    useCompletedCarouselImages({ enabled: isFocused });
  const { data: almanac, isPending: almanacPending } = useQuery({
    queryKey: queryKeys.almanac.singleton(),
    queryFn: fetchAlmanac,
    enabled: isFocused,
  });
  const { data: brochure, isPending: brochurePending } = useQuery({
    queryKey: queryKeys.brochure.singleton(),
    queryFn: fetchBrochure,
    enabled: isFocused,
  });

  return (
    <SafeAreaView style={[globalStyle.screen]} edges={["left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{
            backgroundColor: theme.backgroundColorLight,
            paddingTop: insets.top + 18,
            paddingBottom: 24,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.06)",
          }}
        >
          <Text
            style={{
              fontSize: 38,
              fontFamily: theme.fontBold,
              color: theme.redMuted,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Expressions India
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 15,
              textAlign: "center",
              color: theme.textSecondary,
            }}
          >
            National Life Skills & School Wellness Program
          </Text>
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
        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <RecentFeed />
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

        {/* Downloads */}
        {(almanacPending || brochurePending || almanac || brochure) && (
          <View
            style={{
              paddingHorizontal: 15,
              marginTop: 24,
              marginBottom: 24,
              gap: 14,
            }}
          >
            {/* <SectionTitle label="" /> */}

            {almanacPending ? (
              <DownloadCardSkeleton />
            ) : almanac?.pdfUrl ? (
              <DownloadCard
                title={almanac.title}
                description={almanac.description}
                thumbnailUrl={almanac.thumbnailUrl}
                url={almanac.pdfUrl}
                delay={0}
              />
            ) : null}

            {brochurePending ? (
              <DownloadCardSkeleton />
            ) : brochure?.pdfUrl ? (
              <DownloadCard
                title={brochure.title}
                description={brochure.description}
                thumbnailUrl={brochure.thumbnailUrl}
                url={brochure.pdfUrl}
                delay={80}
              />
            ) : null}
          </View>
        )}
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
        gap: 10,
        paddingHorizontal: 15,
        marginTop: 24,
        marginBottom: 4,
      }}
    >
      <View
        style={{
          width: 3,
          height: 20,
          backgroundColor: lightRed,
          borderRadius: 2,
        }}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: theme.fontBold,
          color: theme.textPrimary,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: lightRed,
          opacity: 0.22,
        }}
      />
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
  thumbnailUrl,
  url,
  delay,
}: {
  title: string;
  description: string;
  thumbnailUrl: string | null | undefined;
  url: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(450).delay(200 + delay)}>
      <Pressable
        onPress={async () => {
          try {
            await Linking.openURL(url);
          } catch {
            Alert.alert("Error", "Could not open the link.");
          }
        }}
        style={({ pressed }) => [
          {
            backgroundColor: "hsl(0 0% 97%)",
            borderRadius: 5,
            padding: 10,
            borderWidth: 1,
            borderColor: "hsl(0 0% 93%)",
            overflow: "hidden",
          },
          pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
        ]}
      >
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: 180,
              backgroundColor: theme.backgroundColorDark,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )}
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
              // borderRadius: 10,
              backgroundColor: "transparent",
              alignItems: "flex-end",
              alignSelf: "flex-end",
              justifyContent: "flex-end",
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

function DownloadCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        borderRadius: 16,
        padding: 10,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 180,
          backgroundColor: theme.backgroundColorDark,
          borderRadius: 8,
        }}
      />
      <View style={{ padding: 14, gap: 8 }}>
        <View
          style={{
            height: 16,
            width: "40%",
            backgroundColor: theme.backgroundColorDark,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            height: 12,
            width: "80%",
            backgroundColor: theme.backgroundColorDark,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}
