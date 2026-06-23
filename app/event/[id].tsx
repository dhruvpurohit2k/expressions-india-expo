import { useImageContext } from "@/src/context/imageContext";
import { safeDate } from "@/src/lib/date";
import { useEvent } from "@/src/hooks/useEvent";
import { useIsFocused  } from "expo-router";
import { StatusBar } from "expo-status-bar";
import JustifiedText from "@/src/components/JustifiedText";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { format as formatDate, parse, isValid } from "date-fns";

function parseTime(time: string): Date | null {
  const withSeconds = parse(time, "HH:mm:ss", new Date());
  if (isValid(withSeconds)) return withSeconds;
  const withoutSeconds = parse(time, "HH:mm", new Date());
  if (isValid(withoutSeconds)) return withoutSeconds;
  return null;
}
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Download,
  Images,
  IndianRupee,
  Play,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Extrapolation,
  SlideInDown,
  SlideInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { Event } from "@/src/types/event";

const CARD_PEEK = 60;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const upcomingLabel = {
  fontSize: 11,
  fontFamily: theme.fontBold,
  color: theme.red,
  textTransform: "uppercase" as const,
  letterSpacing: 0.8,
  marginBottom: 6,
} as const;

const upcomingValue = {
  fontSize: 15,
  fontFamily: theme.font,
  color: theme.text,
  lineHeight: 22,
} as const;
const IMAGE_PREVIEW_COUNT = 3;

function toAbsoluteUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function isImageType(fileType: string) {
  if (!fileType) return true; // treat unknown as image (legacy data has no fileType)
  return fileType.startsWith("image/");
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i,
  );
  return match?.[1] ?? null;
}

function getYouTubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ─── Upcoming Event Detail (hero image + slide-up card) ───

function UpcomingEventDetail({
  event,
  globalStyle,
}: {
  event: Event;
  globalStyle: ReturnType<typeof styleFactory>;
}) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const HERO_HEIGHT = SCREEN_HEIGHT - CARD_PEEK;
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const { setImage } = useImageContext();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const promoImages = (event.promotionalMedia ?? [])
    .filter((m) => isImageType(m.fileType))
    .map((m) => ({ id: m.id, url: toAbsoluteUrl(m.url) }))
    .filter((m): m is { id: string; url: string } => m.url !== null);

  const promoVideos = (event.promotionalVideoLinks ?? [])
    .map((link) => {
      const ytId = extractYouTubeId(link.url);
      return ytId ? { id: link.id, url: link.url, youtubeId: ytId } : null;
    })
    .filter(Boolean) as { id: string; url: string; youtubeId: string }[];

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.5],
      [0, 0.65],
      Extrapolation.CLAMP,
    ),
  }));

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
    return { transform: [{ translateY }, { scale }] };
  });

  const onImageScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}>
      {/* Floating back button — absolute so it floats over the hero */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          {
            position: "absolute",
            top: insets.top + 14,
            left: 15,
            zIndex: 20,
            padding: 8,
            borderRadius: 10,
            backgroundColor: "rgba(0,0,0,0.35)",
          },
          pressed && { opacity: 0.7 },
        ]}
      >
        <ChevronLeft size={22} color="white" strokeWidth={2.5} />
      </Pressable>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero — first item in ScrollView so the card scrolls on top of it.
            Horizontal FlatList inside vertical ScrollView is handled natively. */}
        <View style={{ height: HERO_HEIGHT, overflow: "hidden" }}>
          {promoImages.length > 0 ? (
            <>
              <Animated.View
                entering={SlideInUp.duration(800).withInitialValues({
                  opacity: 0,
                  transform: [{ translateY: -HERO_HEIGHT }],
                })}
                style={[{ width: "100%", height: "100%" }, heroAnimatedStyle]}
              >
                <FlatList
                  data={promoImages}
                  keyExtractor={(item) => item.id}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={onImageScroll}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setImage(item.url);
                        router.push("/modal");
                      }}
                      style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}
                    >
                      <Animated.Image
                        source={{ uri: item.url }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="contain"
                      />
                    </Pressable>
                  )}
                />
              </Animated.View>

              {promoImages.length > 1 && (
                <View
                  style={{
                    position: "absolute",
                    bottom: CARD_PEEK + 16,
                    alignSelf: "center",
                    flexDirection: "row",
                    gap: 6,
                  }}
                  pointerEvents="none"
                >
                  {promoImages.map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: activeImageIndex === i ? 20 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          activeImageIndex === i
                            ? "white"
                            : "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </View>
              )}

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

        {/* Card — negative marginTop overlaps the hero bottom by CARD_PEEK.
            Rendered after hero so it naturally appears on top when scrolled. */}
        <Animated.View
          entering={SlideInDown.duration(1000)
            .delay(500)
            .withInitialValues({ opacity: 0, translateY: SCREEN_HEIGHT })}
        >
          <View
            style={{
              marginTop: -CARD_PEEK,
              minHeight: SCREEN_HEIGHT,
              backgroundColor: theme.backgroundColorLight,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
            }}
          >
            {/* Peek area */}
            <View style={{ alignItems: "center", paddingTop: 12 }}>
              <View
                style={{
                  width: 48,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: "#D0D0D0",
                  marginBottom: 8,
                }}
              />
              <Text
                ellipsizeMode="tail"
                style={[
                  globalStyle.sectionHeading,
                  { marginTop: 0, textAlign: "center", fontSize: 18 },
                ]}
              >
                {event.title}
              </Text>
              <Text
                style={{
                  color: "#999",
                  fontSize: 12,
                  fontFamily: theme.font,
                  marginTop: 2,
                }}
              >
                Swipe up for details
              </Text>
            </View>

            {/* Content */}
            <View style={{ paddingTop: 20 }}>
              {/* Description */}
              <View style={{ marginBottom: 28 }}>
                <JustifiedText
                  paragraphs={[(event.description ?? "No description available.")]}
                  fontSize={15}
                  lineHeight={25}
                  color="hsl(0,0%,38%)"
                />
              </View>

              {/* Perks */}
              {event.perks && event.perks.length > 0 && (
                <View style={{ marginBottom: 28 }}>
                  <Text style={upcomingLabel}>What's Included</Text>
                  <View style={{ gap: 10 }}>
                    {event.perks.map((value, index) => (
                      <View
                        key={index}
                        style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={17}
                          color={theme.red}
                          style={{ marginTop: 2 }}
                        />
                        <Text style={[upcomingValue, { flex: 1 }]}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Date & Time */}
              <View style={{ marginBottom: 24 }}>
                <Text style={upcomingLabel}>Date & Time</Text>
                <Text style={upcomingValue}>
                  {(() => {
                    const sd = safeDate(event.startDate);
                    const ed = safeDate(event.endDate);
                    if (!sd) return "Date TBA";
                    return ed
                      ? `${formatDate(sd, "do MMM, yy")} – ${formatDate(ed, "do MMM, yy")}`
                      : formatDate(sd, "do MMM, yy");
                  })()}
                </Text>
                {(() => {
                  const start = event.startTime ? parseTime(event.startTime) : null;
                  const end = event.endTime ? parseTime(event.endTime) : null;
                  if (!start) return null;
                  return (
                    <Text style={[upcomingValue, { marginTop: 2, color: "hsl(0,0%,55%)" }]}>
                      {formatDate(start, "hh:mm a")}
                      {end ? ` – ${formatDate(end, "hh:mm a")}` : ""}
                    </Text>
                  );
                })()}
              </View>

              {/* Venue */}
              <View style={{ marginBottom: 24 }}>
                <Text style={upcomingLabel}>Venue</Text>
                <Text style={upcomingValue}>
                  {event.location ?? "Location will be announced soon."}
                </Text>
              </View>

              {/* Fee */}
              <View style={{ marginBottom: 28 }}>
                <Text style={upcomingLabel}>Fee</Text>
                {event.isPaid ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <IndianRupee size={14} color={theme.text} />
                    <Text style={upcomingValue}>{event.price ?? 0}</Text>
                  </View>
                ) : (
                  <Text style={[upcomingValue, { color: "hsl(130,50%,38%)" }]}>Free</Text>
                )}
              </View>
              {promoVideos.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={upcomingLabel}>Promo Videos</Text>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/event/videos",
                        params: {
                          urls: JSON.stringify(promoVideos.map((v) => v.url)),
                        },
                      })
                    }
                    style={({ pressed }) => [
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: theme.sectionHeadingColor,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      },
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <Play size={18} color="white" fill="white" />
                    <Text
                      style={{
                        color: "white",
                        fontFamily: theme.fontBold,
                        fontSize: 14,
                        marginLeft: 8,
                      }}
                    >
                      Watch Promo Videos ({promoVideos.length})
                    </Text>
                  </Pressable>
                </View>
              )}
              {event.promotionalDocuments &&
                event.promotionalDocuments.length > 0 && (
                  <View style={{ marginBottom: 24 }}>
                    <Text style={upcomingLabel}>Documents</Text>
                    <View style={{ gap: 8 }}>
                      {event.promotionalDocuments.map((doc, index) => (
                        <Pressable
                          key={doc.id}
                          onPress={async () => {
                            const url = toAbsoluteUrl(doc.url);
                            if (!url) return;
                            try {
                              await Linking.openURL(url);
                            } catch {
                              Alert.alert("Error", "Could not open document.");
                            }
                          }}
                          style={({ pressed }) => [
                            {
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: "hsl(0, 0%, 97%)",
                              padding: 14,
                              borderRadius: 10,
                            },
                            pressed && { opacity: 0.8 },
                          ]}
                        >
                          <Download
                            size={18}
                            color={theme.sectionHeadingColor}
                            strokeWidth={2}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: theme.text,
                              fontFamily: theme.fontBold,
                              marginLeft: 10,
                            }}
                            numberOfLines={1}
                          >
                            {doc.name || `Document ${index + 1}`}
                          </Text>
                          <Text style={{ fontSize: 12, color: "#999" }}>
                            {doc.fileType?.split("/").pop()?.toUpperCase() ??
                              "FILE"}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              <Pressable
                onPress={async () => {
                  if (!event.registrationUrl) return;
                  try {
                    await Linking.openURL(event.registrationUrl);
                  } catch {
                    Alert.alert("Error", "Could not open registration link.");
                  }
                }}
                disabled={!event.registrationUrl}
                style={({ pressed }) => [
                  {
                    backgroundColor: theme.sectionHeadingColor,
                    padding: 14,
                    borderRadius: 12,
                    marginTop: 8,
                    alignSelf: "center",
                  },
                  pressed && event.registrationUrl && { opacity: 0.85 },
                  !event.registrationUrl && { opacity: 0.5 },
                ]}
              >
                <Text style={{ color: "white", fontFamily: theme.fontBold }}>
                  Register
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

// ─── Completed Event Detail ───

function CompletedEventDetail({
  event,
  globalStyle,
}: {
  event: Event;
  globalStyle: ReturnType<typeof styleFactory>;
}) {
  const insets = useSafeAreaInsets();
  const { setImage } = useImageContext();

  const mediaImages = (event.medias ?? [])
    .filter((m) => isImageType(m.fileType))
    .map((m) => ({ id: m.id, url: toAbsoluteUrl(m.url) }))
    .filter((m): m is { id: string; url: string } => m.url !== null);

  const documents = (event.documents ?? [])
    .map((d) => ({ id: d.id, url: toAbsoluteUrl(d.url), name: d.name, fileType: d.fileType }))
    .filter((d): d is { id: string; url: string; name: string; fileType: string } => d.url !== null);

  const videoLinks = (event.videoLinks ?? [])
    .map((link) => {
      const ytId = extractYouTubeId(link.url);
      return ytId ? { id: link.id, url: link.url, youtubeId: ytId } : null;
    })
    .filter(Boolean) as { id: string; url: string; youtubeId: string }[];

  const previewImages = mediaImages.slice(0, IMAGE_PREVIEW_COUNT);
  const allImageUrls = mediaImages.map((m) => m.url);

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          backgroundColor: theme.red,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            {
              padding: 6,
              borderRadius: 8,
            },
            pressed && { backgroundColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <ChevronLeft size={24} color="white" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text
          style={[
            globalStyle.sectionHeading,
            { marginTop: 0, marginBottom: 4 },
          ]}
        >
          {event.title}
        </Text>

        {/* Description */}
        {event.description && (
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <JustifiedText
              paragraphs={[event.description]}
              fontSize={16}
              lineHeight={24}
            />
          </View>
        )}

        {/* Date & Venue */}
        <View
          style={{
            backgroundColor: "hsl(0, 0%, 97%)",
            borderRadius: 12,
            padding: 14,
            marginBottom: 24,
            gap: 10,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 13,
                color: "#999",
                fontFamily: theme.fontBold,
                marginBottom: 2,
              }}
            >
              When
            </Text>
            <Text style={{ fontSize: 15, color: theme.text }}>
              {(() => {
                const sd = safeDate(event.startDate);
                const ed = safeDate(event.endDate);
                if (!sd) return "Date TBA";
                return ed
                  ? `${formatDate(sd, "do MMM, yyyy")} – ${formatDate(ed, "do MMM, yyyy")}`
                  : formatDate(sd, "do MMM, yyyy");
              })()}
            </Text>
            {event.startTime && (() => {
              const start = parseTime(event.startTime!);
              const end = event.endTime ? parseTime(event.endTime) : null;
              if (!start) return null;
              return (
                <Text style={{ fontSize: 13, color: "#777", marginTop: 2 }}>
                  {formatDate(start, "hh:mm a")}
                  {end ? ` – ${formatDate(end, "hh:mm a")}` : ""}
                </Text>
              );
            })()}
          </View>
          <View>
            <Text
              style={{
                fontSize: 13,
                color: "#999",
                fontFamily: theme.fontBold,
                marginBottom: 2,
              }}
            >
              Where
            </Text>
            <Text style={{ fontSize: 15, color: theme.text }}>
              {event.isOnline
                ? "Online"
                : (event.location ?? "Location not specified")}
            </Text>
          </View>
        </View>

        {/* ── Media (Images) ── */}
        {mediaImages.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                color: "#777",
                marginBottom: 12,
              }}
            >
              Media
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {previewImages.map((img) => (
                <Pressable
                  key={img.id}
                  onPress={() => {
                    setImage(img.url);
                    router.push("/modal");
                  }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 10,
                      overflow: "hidden",
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Animated.Image
                    source={{ uri: img.url }}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: theme.backgroundColorDark,
                    }}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>

            {mediaImages.length > IMAGE_PREVIEW_COUNT && (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/event/gallery",
                    params: { urls: JSON.stringify(allImageUrls) },
                  })
                }
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    marginTop: 10,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    backgroundColor: theme.sectionHeadingColor,
                    borderRadius: 8,
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Images size={16} color="white" strokeWidth={2} />
                <Text
                  style={{
                    color: "white",
                    fontFamily: theme.fontBold,
                    fontSize: 13,
                    marginLeft: 6,
                  }}
                >
                  View All ({mediaImages.length})
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── Documents ── */}
        {documents.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                color: "#777",
                marginBottom: 12,
              }}
            >
              Documents
            </Text>
            <View style={{ gap: 8 }}>
              {documents.map((doc, index) => (
                <Pressable
                  key={doc.id}
                  onPress={async () => {
                    try {
                      await Linking.openURL(doc.url);
                    } catch {
                      Alert.alert("Error", "Could not open document.");
                    }
                  }}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "hsl(0, 0%, 97%)",
                      padding: 14,
                      borderRadius: 10,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Download
                    size={18}
                    color={theme.sectionHeadingColor}
                    strokeWidth={2}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: theme.text,
                      fontFamily: theme.fontBold,
                      marginLeft: 10,
                    }}
                    numberOfLines={1}
                  >
                    {doc.name || `Document ${index + 1}`}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#999" }}>
                    {(doc.fileType || "").split("/").pop()?.toUpperCase() || "FILE"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── Video Links ── */}
        {videoLinks.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                color: "#777",
                marginBottom: 12,
              }}
            >
              Videos
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/event/videos",
                  params: {
                    urls: JSON.stringify(videoLinks.map((v) => v.url)),
                  },
                })
              }
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.sectionHeadingColor,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Play size={18} color="white" fill="white" />
              <Text
                style={{
                  color: "white",
                  fontFamily: theme.fontBold,
                  fontSize: 14,
                  marginLeft: 8,
                }}
              >
                Watch Videos ({videoLinks.length})
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Main Event Detail (routes to Upcoming or Completed) ───

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const {
    data: event,
    isLoading,
    error,
  } = useEvent(id, { enabled: isFocused });

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
    <View style={{ flex: 1, backgroundColor: theme.backgroundColorLight }}>
      <StatusBar style="light" />
      {event.status === "completed" ? (
        <CompletedEventDetail event={event} globalStyle={globalStyle} />
      ) : (
        <UpcomingEventDetail event={event} globalStyle={globalStyle} />
      )}
    </View>
  );
}
