import * as store from "@/src/lib/secureStorage";

const TOKEN_KEY = "ei_access_token";
const REFRESH_KEY = "ei_refresh_token";
const USER_KEY = "ei_user_data";

export type StoredUser = { userId: string; email: string; name: string; phone: string; isAdmin: boolean };

export async function storeAuth(
  accessToken: string,
  refreshToken: string,
  user: StoredUser,
): Promise<void> {
  await store.setItem(TOKEN_KEY, accessToken);
  await store.setItem(REFRESH_KEY, refreshToken);
  await store.setItem(USER_KEY, JSON.stringify(user));
}

export async function getToken(): Promise<string | null> {
  try {
    return await store.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await store.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export async function getStoredUser(): Promise<StoredUser | null> {
  try {
    const raw = await store.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export async function clearAuth(): Promise<void> {
  await store.deleteItem(TOKEN_KEY);
  await store.deleteItem(REFRESH_KEY);
  await store.deleteItem(USER_KEY);
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return token !== null && token !== "";
}
