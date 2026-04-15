import type { StoredUser } from "@/src/lib/auth";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "";

export type SignupResult = StoredUser & { accessToken: string; refreshToken: string };

export async function signupApi(
  email: string,
  password: string,
  name: string,
  phone: string,
): Promise<SignupResult> {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, phone }),
  });

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? "Sign up failed");
  }

  return json.data as SignupResult;
}
