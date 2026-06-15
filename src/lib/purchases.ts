/**
 * Stub implementation of the RevenueCat purchase flow.
 *
 * Phase 1: All functions simulate success after a delay.
 * Phase 2: Replace with real `react-native-purchases` SDK calls.
 */

const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

/**
 * Initialize the RevenueCat SDK.
 * Stub: Logs a message and checks for the API key.
 */
export async function initPurchases(): Promise<void> {
  if (!REVENUECAT_API_KEY) {
    console.warn(
      "[STUB] RevenueCat API key not set (EXPO_PUBLIC_REVENUECAT_API_KEY) — running in stub mode"
    );
  }
  console.log("[STUB] RevenueCat initialized (stub mode)");
}

/**
 * Trigger an in-app purchase for a course product.
 *
 * Stub: Simulates a 1-second delay (fake Google Play payment sheet),
 * then returns a dummy receipt token.
 *
 * @param productId - The Google Play product ID for the course.
 * @returns A receipt token to send to the backend for verification.
 */
export async function purchaseCourse(
  productId: string
): Promise<{ receiptToken: string }> {
  console.log(`[STUB] Purchase initiated for product: ${productId}`);

  // Simulate the Google Play payment sheet delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const dummyToken = `stub_receipt_${productId}_${Date.now()}`;
  console.log(`[STUB] Purchase succeeded — token: ${dummyToken}`);

  return { receiptToken: dummyToken };
}

/**
 * Restore previous purchases (e.g. when user switches devices).
 *
 * Stub: Returns an empty array.
 */
export async function restorePurchases(): Promise<string[]> {
  console.log("[STUB] restorePurchases called — returning empty");
  return [];
}
