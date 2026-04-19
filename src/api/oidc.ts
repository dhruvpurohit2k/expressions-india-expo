import { API_URL } from "../lib/config";
import type { StoredUser } from "@/src/lib/auth";

const BASE_URL =
  API_URL?.replace(/\/api\/?$/, "") ?? "";

export type OIDCResult = StoredUser & {
  accessToken: string;
  refreshToken: string;
};

async function postOIDC(
  endpoint: "google" | "apple",
  idToken: string,
  name?: string,
): Promise<OIDCResult> {
  const response = await fetch(`${BASE_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, name }),
  });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? "Sign-in failed");
  }
  return json.data as OIDCResult;
}

export const loginWithGoogle = (idToken: string, name?: string) =>
  postOIDC("google", idToken, name);

export const loginWithApple = (idToken: string, name?: string) =>
  postOIDC("apple", idToken, name);
