import { useImageContext } from "@/src/context/imageContext";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { EventSchema } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { format as formatDate, parse } from "date-fns";
import { Link, router, useLocalSearchParams } from "expo-router";
import { IndianRupee } from "lucide-react-native";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  interpolate,
  SlideInDown,
  SlideInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HERO_HEIGHT = SCREEN_HEIGHT - 90;
const CARD_PEEK = 90;
const API_BASE_URL = "http://192.168.1.12:5000";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function getEvent(id: string) {
  const res = await fetch(`${API_BASE_URL}/event/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  const data = await res.json();
  const parsed = EventSchema.safeParse(data);

  if (!parsed.success) {
    console.log("Event parse failed:", parsed.error.flatten(), data);
    throw new Error("Failed to parse event data");
  }

  return parsed.data;
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
    enabled: !!id,
  });
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const scrollY = useSharedValue(0);
  const { setImage } = useImageContext();

  const { data: event, isLoading, error } = useEvent(id);

  const heroImage = event?.uploadedMedia?.[0]?.url
    ? toAbsoluteUrl(event.uploadedMedia[0].url)
    : null;

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.5],
      [0, 0.65],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0, HERO_HEIGHT],
      [-HERO_HEIGHT * 0.3, 0, HERO_HEIGHT * 0.18],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0, HERO_HEIGHT],
      [1.3, 1, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.sectionHeadingColor} />
        <Text style={globalStyle.text}>Loading event...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center", padding: 20 },
        ]}
      >
        <Text style={[globalStyle.sectionHeading, { textAlign: "center" }]}>
          Could not load event
        </Text>
        <Text style={[globalStyle.text, { textAlign: "center" }]}>
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text style={globalStyle.text}>Event not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyle.screen}>
      <View style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: HERO_HEIGHT,
            overflow: "hidden",
            backgroundColor: theme.backgroundColorLight,
          }}
        >
          {heroImage ? (
            <>
              <Animated.Image
                source={{ uri: heroImage }}
                entering={SlideInUp.duration(1000)
                  .delay(200)
                  .withInitialValues({ opacity: 0, translateY: 100 })}
                style={[
                  {
                    width: "100%",
                    height: "100%",
                  },
                  heroAnimatedStyle,
                ]}
                resizeMode="contain"
              />
              <Animated.View
                pointerEvents="none"
                style={[
                  {
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "black",
                  },
                  overlayAnimatedStyle,
                ]}
              />
            </>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: theme.sectionHeadingColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontFamily: theme.fontBold }}>
                Event
              </Text>
            </View>
          )}
        </View>

        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          entering={SlideInDown.duration(1000)
            .delay(500)
            .withInitialValues({ opacity: 0, translateY: -100 })}
          bounces
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          <Pressable
            onPress={() => {
              if (!heroImage) return;
              setImage(heroImage);
              router.push("/modal");
            }}
            style={{
              height: HERO_HEIGHT - CARD_PEEK,
            }}
          />

          <View
            style={{
              minHeight: SCREEN_HEIGHT,
              backgroundColor: theme.backgroundColorLight,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 18,
              paddingBottom: 40,
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 48,
                height: 5,
                borderRadius: 999,
                backgroundColor: "#D0D0D0",
                alignSelf: "center",
                marginBottom: 14,
              }}
            />

            <Animated.Text
              style={[
                globalStyle.sectionHeading,
                {
                  marginTop: 0,
                  textAlign: "center",
                },
              ]}
            >
              {event.title}
            </Animated.Text>

            <Text
              style={[
                globalStyle.text,
                {
                  textAlign: "center",
                  marginTop: 0,
                  color: "#777777",
                  marginBottom: 8,
                },
              ]}
            >
              Swipe up to view details
            </Text>

            <View style={[{ marginHorizontal: 0 }]}>
              <Text
                style={[
                  {
                    fontSize: 18,
                    textAlign: "justify",
                    color: "#777",
                    marginVertical: 20,
                  },
                ]}
              >
                {event.description ?? "No description available."}
              </Text>
            </View>

            <Text style={[{ fontSize: 20, color: "#777" }]}>Perks</Text>
            <View>
              {event.perks &&
                event.perks.map((value, index) => {
                  return (
                    <View key={index}>
                      <View
                        style={[
                          { flexDirection: "row", alignItems: "flex-start" },
                        ]}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#070"
                        />
                        <Text>{value}</Text>
                      </View>
                    </View>
                  );
                })}
            </View>

            <View style={[{ marginVertical: 20 }]}>
              <Text
                style={[{ fontSize: 20, color: "#777", marginVertical: 5 }]}
              >
                Date & Time
              </Text>
              <Text style={[]}>
                {formatDate(event.startDate, "do MMM, yy")}
                {event.endDate
                  ? ` - ${formatDate(event.endDate, "do MMM, yy")}`
                  : ""}
              </Text>
              <Text style={[]}>
                {event.startTime &&
                  formatDate(
                    parse(event.startTime, "HH:mm:ss", new Date()),
                    "hh:mm a",
                  )}
                {event.endTime
                  ? ` - ${formatDate(parse(event.endTime, "HH:mm:ss", new Date()), "hh:mm a")}`
                  : ""}
              </Text>
            </View>

            <View style={[{ marginHorizontal: 0 }]}>
              <Text
                style={[{ fontSize: 20, color: "#777", marginVertical: 5 }]}
              >
                Venue
              </Text>
              <Text style={[]}>
                {event.location ?? "Location will be announced soon."}
              </Text>
            </View>

            <View style={[{ marginHorizontal: 0 }]}>
              <Text
                style={[{ fontSize: 20, color: "#777", marginVertical: 5 }]}
              >
                Fee
              </Text>
              <Text style={[]}>
                {event.isPaid ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IndianRupee size={12} />
                    <Text style={{ fontSize: 14 }}>{event.price ?? 0}</Text>
                  </View>
                ) : (
                  "Free"
                )}
              </Text>
            </View>

            <Link href="/registration" asChild>
              <Pressable
                style={{
                  backgroundColor: theme.sectionHeadingColor,
                  padding: 14,
                  borderRadius: 12,
                  marginTop: 8,
                  alignSelf: "center",
                }}
              >
                <Text style={{ color: "white", fontFamily: theme.fontBold }}>
                  Registration Link
                </Text>
              </Pressable>
            </Link>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}
