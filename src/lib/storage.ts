import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = "ei_onboarding_done";

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const val = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export async function markOnboardingDone(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
  } catch {
    // ignore storage errors — don't block the user
  }
}
