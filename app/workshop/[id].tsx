import { useImageContext } from "@/src/context/imageContext";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { WorkshopSchema } from "@/src/types";
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

export async function getWorkshop(id: string) {
  const res = await fetch(`${API_BASE_URL}/workshop/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch workshop");
  }

  const data = await res.json();
  const parsed = WorkshopSchema.safeParse(data);

  if (!parsed.success) {
    console.log("Workshop parse failed:", parsed.error.flatten(), data);
    throw new Error("Failed to parse workshop data");
  }

  return parsed.data;
}

export function useWorkshop(id: string) {
  return useQuery({
    queryKey: ["workshop", id],
    queryFn: () => getWorkshop(id),
    enabled: !!id,
  });
}

export default function WorkshopDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const scrollY = useSharedValue(0);
  const { setImage } = useImageContext();

  const { data: workshop, isLoading, error } = useWorkshop(id);

  const heroImage = workshop?.uploadedMedia?.[0]?.url
    ? toAbsoluteUrl(workshop.uploadedMedia[0].url)
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
        <Text style={globalStyle.text}>Loading workshop...</Text>
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
          Could not load workshop
        </Text>
        <Text style={[globalStyle.text, { textAlign: "center" }]}>
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </SafeAreaView>
    );
  }

  if (!workshop) {
    return (
      <SafeAreaView
        style={[
          globalStyle.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text style={globalStyle.text}>Workshop not found.</Text>
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
                style={[
                  {
                    width: "100%",
                    height: "100%",
                  },
                  heroAnimatedStyle,
                ]}
                resizeMode="contain"
                entering={SlideInUp.duration(1000)
                  .delay(50)
                  .withInitialValues({ opacity: 0, translateY: 100 })}
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
                Workshop
              </Text>
            </View>
          )}
        </View>

        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          entering={SlideInDown.duration(1000)
            .delay(200)
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
              {workshop.title}
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

            {workshop.type && (
              <View style={[{ marginHorizontal: 0, marginBottom: 12 }]}>
                <Text
                  style={[{ fontSize: 20, color: "#777", marginVertical: 5 }]}
                >
                  Type
                </Text>
                <Text style={[]}>{workshop.type}</Text>
              </View>
            )}

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
                {workshop.description ?? "No description available."}
              </Text>
            </View>

            <Text style={[{ fontSize: 20, color: "#777" }]}>Perks</Text>
            <View>
              {workshop.perks &&
                workshop.perks.map((value, index) => {
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
                Date &amp; Time
              </Text>
              <Text style={[]}>
                {formatDate(workshop.startDate, "do MMM, yy")}
                {workshop.endDate
                  ? ` - ${formatDate(workshop.endDate, "do MMM, yy")}`
                  : ""}
              </Text>
              <Text style={[]}>
                {workshop.startTime &&
                  formatDate(
                    parse(workshop.startTime, "HH:mm:ss", new Date()),
                    "hh:mm a",
                  )}
                {workshop.endTime
                  ? ` - ${formatDate(parse(workshop.endTime, "HH:mm:ss", new Date()), "hh:mm a")}`
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
                {workshop.location ?? "Location will be announced soon."}
              </Text>
            </View>

            <View style={[{ marginHorizontal: 0 }]}>
              <Text
                style={[{ fontSize: 20, color: "#777", marginVertical: 5 }]}
              >
                Fee
              </Text>
              <Text style={[]}>
                {workshop.isPaid ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IndianRupee size={12} />
                    <Text style={{ fontSize: 14 }}>{workshop.price ?? 0}</Text>
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
