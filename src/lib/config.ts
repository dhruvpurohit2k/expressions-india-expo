export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://13.233.174.131/api";

if (API_URL.includes("loca.lt")) {
  const _fetch = global.fetch;
  global.fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    headers.set("bypass-tunnel-reminder", "true");
    return _fetch(input, { ...init, headers });
  };
}
