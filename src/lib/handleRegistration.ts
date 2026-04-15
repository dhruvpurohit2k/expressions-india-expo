import { router } from "expo-router";
import { Linking } from "react-native";
import { getStoredUser } from "./auth";

/**
 * Handles registration/purchase by checking auth status and opening the registration URL.
 * If user is not logged in, redirects to login screen.
 * If URL is empty/null, does nothing.
 * If URL is valid, opens it with Linking.openURL().
 */
export async function handleRegistration(
  registrationUrl: string | null | undefined,
  redirectRoute?: string,
) {
  // If URL is empty/null, do nothing
  if (!registrationUrl) return;

  // Check if user is logged in
  const user = await getStoredUser();
  if (!user) {
    // Redirect to login with a return path
    router.push({
      pathname: "/login",
      params: {
        redirectCourseId: redirectRoute ? encodeURIComponent(redirectRoute) : undefined,
      },
    });
    return;
  }

  // User is logged in, open the registration URL
  try {
    await Linking.openURL(registrationUrl);
  } catch (error) {
    console.error("Failed to open registration URL:", error);
  }
}
