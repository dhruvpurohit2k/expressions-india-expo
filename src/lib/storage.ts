import * as store from "@/src/lib/secureStorage";

const ONBOARDING_KEY = "ei_onboarding_done";

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const val = await store.getItem(ONBOARDING_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export async function markOnboardingDone(): Promise<void> {
  try {
    await store.setItem(ONBOARDING_KEY, "true");
  } catch {
    // ignore storage errors — don't block the user
  }
}
