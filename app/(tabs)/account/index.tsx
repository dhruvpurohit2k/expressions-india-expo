import { useCallback, useState } from "react";
import { View, Text, Pressable, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQueryClient } from "@tanstack/react-query";

import { getStoredUser, clearAuth, type StoredUser } from "@/src/lib/auth";
import { theme } from "@/src/theme";
import { queryKeys } from "@/src/lib/queryKeys";

export default function AccountScreen() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getStoredUser().then((u) => {
        if (active) {
          setUser(u);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  async function doLogout() {
    await clearAuth();
    queryClient.removeQueries({ queryKey: queryKeys.courses.all() });
    setUser(null);
  }

  function handleLogout() {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to log out?")) doLogout();
      return;
    }
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: doLogout },
    ]);
  }

  if (loading) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.backgroundColor }}
      edges={["top"]}
    >
      {user ? (
        <LoggedInView user={user} onLogout={handleLogout} />
      ) : (
        <LoggedOutView />
      )}
    </SafeAreaView>
  );
}

// ── Logged-in view ────────────────────────────────────────────────────────────

function LoggedInView({
  user,
  onLogout,
}: {
  user: StoredUser;
  onLogout: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
      <Text
        style={{
          fontFamily: theme.fontBold,
          fontSize: 26,
          color: theme.sectionHeadingColor,
          marginBottom: 24,
        }}
      >
        My Account
      </Text>

      <Animated.View
        entering={FadeInDown.duration(350)}
        style={{
          backgroundColor: theme.backgroundColorLight,
          borderRadius: 16,
          elevation: 2,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {user.name ? (
          <InfoRow
            icon="person-outline"
            label="Name"
            value={user.name}
            last={false}
          />
        ) : null}
        <InfoRow
          icon="mail-outline"
          label="Email"
          value={user.email}
          last={!user.phone}
        />
        {user.phone ? (
          <InfoRow
            icon="call-outline"
            label="Phone"
            value={user.phone}
            last={true}
          />
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(350).delay(80)}>
        <Pressable
          onPress={onLogout}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: theme.backgroundColorLight,
            borderRadius: 16,
            paddingHorizontal: 18,
            paddingVertical: 16,
            elevation: 2,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.red} />
          <Text
            style={{
              fontFamily: theme.fontBold,
              fontSize: 15,
              color: theme.red,
            }}
          >
            Log out
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  last: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.backgroundColorDark,
      }}
    >
      <Ionicons name={icon} size={18} color="hsl(0,0%,55%)" />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: theme.font,
            fontSize: 11,
            color: "hsl(0,0%,55%)",
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: theme.fontBold,
            fontSize: 15,
            color: theme.text,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ── Logged-out view ───────────────────────────────────────────────────────────

function LoggedOutView() {
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}
    >
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{ alignItems: "center" }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "hsl(4, 65%, 95%)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="person-outline" size={32} color={theme.red} />
        </View>

        <Text
          style={{
            fontFamily: theme.fontBold,
            fontSize: 22,
            color: theme.sectionHeadingColor,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          You're not signed in
        </Text>
        <Text
          style={{
            fontFamily: theme.font,
            fontSize: 14,
            color: theme.text,
            opacity: 0.6,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 20,
          }}
        >
          Sign in to access your courses and personalised content.
        </Text>

        <Pressable
          onPress={() => router.push("/login?from=account")}
          style={({ pressed }) => ({
            backgroundColor: theme.red,
            borderRadius: 12,
            paddingHorizontal: 40,
            paddingVertical: 14,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: theme.fontBold,
              fontSize: 15,
              color: "white",
            }}
          >
            Sign In
          </Text>
        </Pressable>

      </Animated.View>
    </View>
  );
}
