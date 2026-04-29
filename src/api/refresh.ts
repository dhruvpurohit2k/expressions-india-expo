import { API_URL } from "../lib/config";
import { getRefreshToken, storeAuth, clearAuth, StoredUser } from "@/src/lib/auth";

const BASE_URL =
  API_URL?.replace(/\/api\/?$/, "") ?? "";

type RefreshResult = StoredUser & { accessToken: string; refreshToken: string };

let _refreshPromise: Promise<string | null> | null = null;

/**
 * Attempts a token refresh using the stored refresh token.
 * Returns the new access token on success, or null if the refresh token is
 * missing / expired (the stored auth is cleared in that case).
 *
 * Multiple concurrent callers share a single in-flight request (singleton).
 */
export async function tryRefresh(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise;

  const doRefresh = async (): Promise<string | null> => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.accessToken) {
        await clearAuth();
        return null;
      }
      const data = json.data as RefreshResult;
      // Guard against the logout race: if clearAuth() ran while the network
      // request was in-flight, the refresh token is gone — don't re-store.
      const stillValid = await getRefreshToken();
      if (!stillValid) return null;
      await storeAuth(data.accessToken, data.refreshToken, {
        userId: data.userId,
        email: data.email,
        name: data.name ?? "",
        phone: data.phone ?? "",
        isAdmin: data.isAdmin,
      });
      return data.accessToken;
    } catch (e) {
      // Network error (offline, server unreachable) — keep stored tokens so the
      // user is not logged out on a transient failure.
      if (e instanceof TypeError) return null;
      await clearAuth();
      return null;
    }
  };

  _refreshPromise = doRefresh().finally(() => {
    _refreshPromise = null;
  });
  return _refreshPromise;
}
