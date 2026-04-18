import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import {
  loginWithGoogle,
  loginWithApple,
  type OIDCResult,
} from "@/src/api/oidc";
import { storeAuth } from "@/src/lib/auth";

// Required so the in-app browser closes itself after the OAuth redirect.
WebBrowser.maybeCompleteAuthSession();

const isNative = Platform.OS === "ios" || Platform.OS === "android";

export const isAppleAvailable = Platform.OS === "ios";
export const isGoogleAvailable = isNative;

export class SignInCancelled extends Error {
  constructor() {
    super("sign-in cancelled");
    this.name = "SignInCancelled";
  }
}

export class SignInUnsupported extends Error {
  constructor(provider: string) {
    super(`${provider} sign-in is not available on this build`);
    this.name = "SignInUnsupported";
  }
}

async function persist(result: OIDCResult): Promise<OIDCResult> {
  await storeAuth(result.accessToken, result.refreshToken, {
    userId: result.userId,
    email: result.email,
    name: result.name ?? "",
    phone: result.phone ?? "",
    isAdmin: result.isAdmin,
  });
  return result;
}

/**
 * useGoogleSignIn — Expo Go-friendly Google OIDC via expo-auth-session.
 * Returns a `promptAsync` you can call from a button handler. On success it
 * exchanges the ID token with the backend and persists the auth bundle.
 *
 * Required env (per-platform OAuth client IDs from Google Cloud Console):
 *   EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID    (for Expo Go)
 *   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID     (iOS dev/standalone build)
 *   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID (Android dev/standalone build)
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID     (web)
 */
export function useGoogleSignIn() {
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  async function signIn(): Promise<OIDCResult> {
    if (!isGoogleAvailable && Platform.OS !== "web") {
      throw new SignInUnsupported("Google");
    }
    const result = await promptAsync();
    if (result.type === "cancel" || result.type === "dismiss") {
      throw new SignInCancelled();
    }
    if (result.type !== "success") {
      throw new Error(`Google sign-in failed: ${result.type}`);
    }
    const idToken =
      (result.params as any).id_token ??
      (result.authentication as any)?.idToken;
    if (!idToken) {
      throw new Error("Google did not return an ID token");
    }
    return persist(await loginWithGoogle(idToken));
  }

  return { signIn, response };
}

function getAppleSdk() {
  // Lazy require so non-iOS bundles never load the native module.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("expo-apple-authentication") as typeof import("expo-apple-authentication");
}

export async function signInWithApple(): Promise<OIDCResult> {
  if (!isAppleAvailable) throw new SignInUnsupported("Apple");
  const AppleAuthentication = getAppleSdk();
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) {
      throw new Error("Apple did not return an identity token");
    }
    const name = [credential.fullName?.givenName, credential.fullName?.familyName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return persist(
      await loginWithApple(credential.identityToken, name || undefined),
    );
  } catch (e: any) {
    if (e?.code === "ERR_REQUEST_CANCELED") throw new SignInCancelled();
    throw e;
  }
}
