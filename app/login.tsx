import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  useGoogleSignIn,
  signInWithApple,
  isAppleAvailable,
  SignInCancelled,
} from "@/src/lib/oidc";
import { markOnboardingDone } from "@/src/lib/storage";
import { theme } from "@/src/theme";

export default function LoginScreen() {
  const { redirectCourseId, redirectChapterId } = useLocalSearchParams<{
    redirectCourseId?: string;
    redirectChapterId?: string;
  }>();

  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signIn: signInWithGoogle } = useGoogleSignIn();

  function navigateAfterAuth() {
    if (redirectCourseId && redirectChapterId) {
      router.replace({
        pathname: "/course/[id]/chapter/[chapterId]",
        params: { id: redirectCourseId, chapterId: redirectChapterId },
      });
    } else {
      router.back();
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading("google");
    try {
      await signInWithGoogle();
      await markOnboardingDone();
      navigateAfterAuth();
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
      await markOnboardingDone();
      navigateAfterAuth();
    } catch (e) {
      if (e instanceof SignInCancelled) return;
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 28,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginBottom: 28,
            alignSelf: "flex-start",
          }}
          hitSlop={12}
        >
          <Text style={{ fontSize: 18, color: theme.sectionHeadingColor }}>←</Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 15,
              color: theme.sectionHeadingColor,
            }}
          >
            Back
          </Text>
        </Pressable>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: theme.fontBold,
              fontSize: 26,
              color: theme.sectionHeadingColor,
              marginBottom: 4,
            }}
          >
            Sign in
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 14,
              color: theme.text,
              opacity: 0.6,
              marginBottom: 28,
            }}
          >
            Continue with your Google or Apple account.
          </Text>

          {error && (
            <View
              style={{
                backgroundColor: "hsl(0, 80%, 95%)",
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.font,
                  fontSize: 13,
                  color: theme.red,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleGoogle}
            disabled={loading !== null}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "hsl(0,0%,85%)",
              borderRadius: 12,
              paddingVertical: 14,
              marginBottom: 12,
              opacity: pressed || loading !== null ? 0.85 : 1,
            })}
          >
            {loading === "google" ? (
              <ActivityIndicator color={theme.text} size="small" />
            ) : (
              <>
                <Ionicons name="logo-google" size={18} color={theme.text} />
                <Text
                  style={{
                    fontFamily: theme.fontBold,
                    fontSize: 15,
                    color: theme.text,
                  }}
                >
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>

          {isAppleAvailable && (
            <Pressable
              onPress={handleApple}
              disabled={loading !== null}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                backgroundColor: "black",
                borderRadius: 12,
                paddingVertical: 14,
                marginBottom: 12,
                opacity: pressed || loading !== null ? 0.85 : 1,
              })}
            >
              {loading === "apple" ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={18} color="white" />
                  <Text
                    style={{
                      fontFamily: theme.fontBold,
                      fontSize: 15,
                      color: "white",
                    }}
                  >
                    Continue with Apple
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
