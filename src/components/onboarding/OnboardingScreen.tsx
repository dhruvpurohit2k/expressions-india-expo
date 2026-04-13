import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/src/theme";
import Button from "@/src/components/ui/button";
import { markOnboardingDone } from "@/src/lib/storage";
import { loginApi } from "@/src/api/login";
import { storeAuth } from "@/src/lib/auth";

type View = "landing" | "login" | "signup";

// ─── Shared input style ────────────────────────────────────────────────────────

const inputStyle = {
  borderWidth: 1,
  borderColor: "hsl(0, 0%, 85%)",
  borderRadius: 8,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontFamily: theme.font,
  fontSize: 15,
  color: theme.text,
  backgroundColor: "white",
  marginBottom: 12,
};

// ─── Back button ──────────────────────────────────────────────────────────────

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.backButton} hitSlop={12}>
      <Text style={styles.backArrow}>←</Text>
      <Text style={styles.backLabel}>Back</Text>
    </Pressable>
  );
}

// ─── Landing view ─────────────────────────────────────────────────────────────

function LandingView({
  onLogin,
  onSignup,
  onSkip,
}: {
  onLogin: () => void;
  onSignup: () => void;
  onSkip: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      {/* Brand */}
      <View style={styles.brand}>
        <Text style={styles.brandName}>Expressions India</Text>
        <Text style={styles.brandTagline}>Nurturing Minds, Enriching Lives</Text>
      </View>

      {/* Welcome copy */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeHeading}>Welcome</Text>
        <Text style={styles.welcomeBody}>
          Log in or create an account to access exclusive courses, events, and
          more.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          onPress={onLogin}
          style={styles.btnFull}
          styles={{ viewStyle: { alignSelf: "stretch" } }}
        >
          Log in
        </Button>

        <Pressable onPress={onSignup} style={({ pressed }) => [
          styles.btnOutline,
          pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
        ]}>
          <Text style={styles.btnOutlineText}>Create account</Text>
        </Pressable>
      </View>

      {/* Skip */}
      <Pressable onPress={onSkip} style={styles.skipButton} hitSlop={12}>
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// ─── Login view ───────────────────────────────────────────────────────────────

function LoginView({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await loginApi(email, password);
      await storeAuth(result.accessToken, {
        userId: result.userId,
        email: result.email,
        isAdmin: result.isAdmin,
      });
      onSubmit();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton onPress={onBack} />

          <Text style={styles.formTitle}>Log in</Text>
          <Text style={styles.formSubtitle}>Welcome back!</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formFields}>
            <TextInput
              style={inputStyle}
              placeholder="Email"
              placeholderTextColor="hsl(0, 0%, 65%)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={inputStyle}
              placeholder="Password"
              placeholderTextColor="hsl(0, 0%, 65%)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button
            onPress={handleSubmit}
            disabled={loading}
            styles={{ viewStyle: { alignSelf: "stretch", marginTop: 8 } }}
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : "Log in"}
          </Button>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Pressable onPress={onBack} hitSlop={8}>
              <Text style={styles.switchLink}>Create one</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Signup view (dummy) ──────────────────────────────────────────────────────

function SignupView({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton onPress={onBack} />

          <Text style={styles.formTitle}>Create account</Text>
          <Text style={styles.formSubtitle}>Join the community.</Text>

          <View style={styles.formFields}>
            <TextInput
              style={inputStyle}
              placeholder="Full name"
              placeholderTextColor="hsl(0, 0%, 65%)"
              autoCapitalize="words"
              autoCorrect={false}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={inputStyle}
              placeholder="Email"
              placeholderTextColor="hsl(0, 0%, 65%)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={inputStyle}
              placeholder="Password"
              placeholderTextColor="hsl(0, 0%, 65%)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button
            onPress={onSubmit}
            styles={{ viewStyle: { alignSelf: "stretch", marginTop: 8 } }}
          >
            Create account
          </Button>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable onPress={onBack} hitSlop={8}>
              <Text style={styles.switchLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function OnboardingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [view, setView] = useState<View>("landing");

  async function finish() {
    await markOnboardingDone();
    onComplete();
  }

  if (view === "login") {
    return (
      <LoginView onBack={() => setView("landing")} onSubmit={finish} />
    );
  }

  if (view === "signup") {
    return (
      <SignupView onBack={() => setView("landing")} onSubmit={finish} />
    );
  }

  return (
    <LandingView
      onLogin={() => setView("login")}
      onSignup={() => setView("signup")}
      onSkip={finish}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },

  // Landing
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
  btnFull: {
    alignSelf: "stretch",
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: theme.red,
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutlineText: {
    fontFamily: theme.fontBold,
    fontSize: 15,
    letterSpacing: 0.5,
    color: theme.red,
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

  // Back button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 28,
    alignSelf: "flex-start",
  },
  backArrow: {
    fontSize: 18,
    color: theme.sectionHeadingColor,
  },
  backLabel: {
    fontFamily: theme.font,
    fontSize: 15,
    color: theme.sectionHeadingColor,
  },

  // Error
  errorBox: {
    backgroundColor: "hsl(0, 80%, 95%)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: theme.font,
    fontSize: 13,
    color: theme.red,
    textAlign: "center",
  },

  // Forms
  formScroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formTitle: {
    fontFamily: theme.fontBold,
    fontSize: 26,
    color: theme.sectionHeadingColor,
    marginBottom: 4,
  },
  formSubtitle: {
    fontFamily: theme.font,
    fontSize: 14,
    color: theme.text,
    opacity: 0.6,
    marginBottom: 28,
  },
  formFields: {
    gap: 0,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchText: {
    fontFamily: theme.font,
    fontSize: 13,
    color: theme.text,
    opacity: 0.6,
  },
  switchLink: {
    fontFamily: theme.fontBold,
    fontSize: 13,
    color: theme.sectionHeadingColor,
  },
});
