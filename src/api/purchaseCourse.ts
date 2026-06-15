import { API_URL } from "../lib/config";
import { getToken } from "../lib/auth";
import { tryRefresh } from "./refresh";
import { safeJson } from "../utils/api";

/**
 * Verify a purchase receipt with the backend and enroll the user in the course.
 *
 * @param courseId - The course UUID.
 * @param receiptToken - The receipt token from the in-app purchase.
 */
export async function verifyPurchase(
  courseId: string,
  receiptToken: string
): Promise<void> {
  const makeRequest = async (token: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_URL}/course/${courseId}/purchase`, {
      method: "POST",
      headers,
      body: JSON.stringify({ receiptToken }),
    });
  };

  let token = await getToken();
  let response = await makeRequest(token);

  if (response.status === 401) {
    const newToken = await tryRefresh();
    if (!newToken) throw new Error("Login required");
    response = await makeRequest(newToken);
  }

  const json: any = await safeJson(response);
  if (!json.success) {
    throw new Error(json.error?.message ?? "Purchase verification failed");
  }
}
