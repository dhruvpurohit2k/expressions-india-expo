import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { theme } from "@/src/theme";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleOAuthRedirect() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // If the parent hasn't navigated away within 10 seconds, something went
    // wrong — go back so the user isn't stuck on a blank screen.
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 10_000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timedOut && router.canGoBack()) {
      router.back();
    }
  }, [timedOut]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.backgroundColorLight,
        gap: 16,
      }}
    >
      <ActivityIndicator size="large" color={theme.sectionHeadingColor} />
      <Text
        style={{
          fontFamily: theme.font,
          fontSize: 15,
          color: theme.text,
        }}
      >
        {timedOut ? "Something went wrong. Going back…" : "Signing in…"}
      </Text>
    </View>
  );
}
