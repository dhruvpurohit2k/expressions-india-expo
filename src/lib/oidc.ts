import { Platform } from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  loginWithGoogle,
  loginWithApple,
  type OIDCResult,
} from "@/src/api/oidc";
import { storeAuth } from "@/src/lib/auth";
import { setItem, getItem } from "@/src/lib/secureStorage";

const APPLE_NAME_KEY = "apple_user_name";

export const isAppleAvailable = Platform.OS === "ios";
export const isGoogleAvailable = Platform.OS === "android" || Platform.OS === "ios";

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

// webClientId must be a Web application type OAuth client from Google Cloud Console.
// This is what causes Google to include an ID token in the sign-in response.
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

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

export async function signInWithGoogle(): Promise<OIDCResult> {
  if (!isGoogleAvailable) throw new SignInUnsupported("Google");
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error("Google did not return an ID token");
    return persist(await loginWithGoogle(idToken));
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (
        e.code === statusCodes.SIGN_IN_CANCELLED ||
        e.code === statusCodes.IN_PROGRESS
      ) {
        throw new SignInCancelled();
      }
    }
    throw e;
  }
}

function getAppleSdk() {
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
    const freshName = [
      credential.fullName?.givenName,
      credential.fullName?.familyName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (freshName) await setItem(APPLE_NAME_KEY, freshName);
    const name = freshName || (await getItem(APPLE_NAME_KEY)) || undefined;
    return persist(await loginWithApple(credential.identityToken, name));
  } catch (e: any) {
    if (e?.code === "ERR_REQUEST_CANCELED") throw new SignInCancelled();
    throw e;
  }
}
