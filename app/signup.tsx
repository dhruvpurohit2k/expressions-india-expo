import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/ui/button";
import { signupApi } from "@/src/api/signup";
import { storeAuth } from "@/src/lib/auth";
import { markOnboardingDone } from "@/src/lib/storage";
import { theme } from "@/src/theme";

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

export default function SignupScreen() {
  const { redirectCourseId, redirectChapterId } =
    useLocalSearchParams<{ redirectCourseId?: string; redirectChapterId?: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await signupApi(email, password, name, phone);
      await storeAuth(result.accessToken, {
        userId: result.userId,
        email: result.email,
        name: result.name ?? "",
        phone: result.phone ?? "",
        isAdmin: result.isAdmin,
      });
      await markOnboardingDone();

      if (redirectCourseId && redirectChapterId) {
        router.replace({
          pathname: "/course/[id]/chapter/[chapterId]",
          params: { id: redirectCourseId, chapterId: redirectChapterId },
        });
      } else {
        router.back();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 28, alignSelf: "flex-start" }}
            hitSlop={12}
          >
            <Text style={{ fontSize: 18, color: theme.sectionHeadingColor }}>←</Text>
            <Text style={{ fontFamily: theme.font, fontSize: 15, color: theme.sectionHeadingColor }}>
              Back
            </Text>
          </Pressable>

          <Text style={{ fontFamily: theme.fontBold, fontSize: 26, color: theme.sectionHeadingColor, marginBottom: 4 }}>
            Create account
          </Text>
          <Text style={{ fontFamily: theme.font, fontSize: 14, color: theme.text, opacity: 0.6, marginBottom: 28 }}>
            Sign up to access courses and content
          </Text>

          {error && (
            <View style={{
              backgroundColor: "hsl(0, 80%, 95%)",
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 10,
              marginBottom: 16,
            }}>
              <Text style={{ fontFamily: theme.font, fontSize: 13, color: theme.red, textAlign: "center" }}>
                {error}
              </Text>
            </View>
          )}

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
            placeholder="Phone (optional)"
            placeholderTextColor="hsl(0, 0%, 65%)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={inputStyle}
            placeholder="Password (min. 8 characters)"
            placeholderTextColor="hsl(0, 0%, 65%)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={inputStyle}
            placeholder="Confirm password"
            placeholderTextColor="hsl(0, 0%, 65%)"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button
            onPress={handleSubmit}
            disabled={loading}
            styles={{ viewStyle: { alignSelf: "stretch", marginTop: 8 } }}
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : "Create account"}
          </Button>

          {/* Link to login */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 4 }}>
            <Text style={{ fontFamily: theme.font, fontSize: 14, color: theme.text, opacity: 0.6 }}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.replace("/login")} hitSlop={8}>
              <Text style={{ fontFamily: theme.fontBold, fontSize: 14, color: theme.red }}>
                Log in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
