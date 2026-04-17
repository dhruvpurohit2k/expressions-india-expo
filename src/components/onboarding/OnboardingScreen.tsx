import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/src/theme";
import { markOnboardingDone } from "@/src/lib/storage";
import {
  useGoogleSignIn,
  signInWithApple,
  isAppleAvailable,
  SignInCancelled,
} from "@/src/lib/oidc";

export default function OnboardingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signIn: signInWithGoogle } = useGoogleSignIn();

  async function finish() {
    await markOnboardingDone();
    onComplete();
  }

  async function handleGoogle() {
    setError(null);
    setLoading("google");
    try {
      await signInWithGoogle();
      await finish();
    } catch (e) {
      if (e instanceof SignInCancelled) return;
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setLoading(null);
    }
  }

  async function handleApple() {
    setError(null);
    setLoading("apple");
    try {
      await signInWithApple();
      await finish();
    } catch (e) {
      if (e instanceof SignInCancelled) return;
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brand}>
        <Text style={styles.brandName}>Expressions India</Text>
        <Text style={styles.brandTagline}>Nurturing Minds, Enriching Lives</Text>
      </View>

      <View style={styles.welcome}>
        <Text style={styles.welcomeHeading}>Welcome</Text>
        <Text style={styles.welcomeBody}>
          Sign in to access exclusive courses, events, and more.
        </Text>
      </View>

      <View style={styles.actions}>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleGoogle}
          disabled={loading !== null}
          style={({ pressed }) => [
            styles.googleBtn,
            (pressed || loading !== null) && { opacity: 0.85 },
          ]}
        >
          {loading === "google" ? (
            <ActivityIndicator color={theme.text} size="small" />
          ) : (
            <>
              <Ionicons name="logo-google" size={18} color={theme.text} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        {isAppleAvailable && (
          <Pressable
            onPress={handleApple}
            disabled={loading !== null}
            style={({ pressed }) => [
              styles.appleBtn,
              (pressed || loading !== null) && { opacity: 0.85 },
            ]}
          >
            {loading === "apple" ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={18} color="white" />
                <Text style={styles.appleBtnText}>Continue with Apple</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      <Pressable onPress={finish} style={styles.skipButton} hitSlop={12}>
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  brand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  brandName: {
    fontFamily: "Delius_400Regular",
    fontSize: 30,
    color: theme.sectionHeadingColor,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontFamily: theme.font,
    fontSize: 13,
    color: theme.text,
    opacity: 0.55,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  welcome: {
    paddingHorizontal: 32,
    paddingBottom: 36,
    alignItems: "center",
  },
  welcomeHeading: {
    fontFamily: theme.fontBold,
    fontSize: 22,
    color: theme.sectionHeadingColor,
    marginBottom: 10,
  },
  welcomeBody: {
    fontFamily: theme.font,
    fontSize: 14,
    color: theme.text,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.75,
  },
  actions: {
    paddingHorizontal: 28,
    gap: 12,
    paddingBottom: 8,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "hsl(0,0%,85%)",
    borderRadius: 5,
    height: 48,
  },
  googleBtnText: {
    fontFamily: theme.fontBold,
    fontSize: 15,
    color: theme.text,
  },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "black",
    borderRadius: 5,
    height: 48,
  },
  appleBtnText: {
    fontFamily: theme.fontBold,
    fontSize: 15,
    color: "white",
  },
  errorBox: {
    backgroundColor: "hsl(0, 80%, 95%)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: {
    fontFamily: theme.font,
    fontSize: 13,
    color: theme.red,
    textAlign: "center",
  },
  skipButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  skipText: {
    fontFamily: theme.font,
    fontSize: 13,
    color: theme.text,
    opacity: 0.5,
    textDecorationLine: "underline",
  },
});
