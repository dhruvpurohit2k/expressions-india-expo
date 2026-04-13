import type { StoredUser } from "@/src/lib/auth";

// Strip /api suffix to get the base server URL for auth endpoints
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "";

export type LoginResult = StoredUser & { accessToken: string };

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResult> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? "Login failed");
  }

  return json.data as LoginResult;
}
