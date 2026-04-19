export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://13.206.10.230.nip.io/api";

if (API_URL.includes("loca.lt")) {
  const _fetch = global.fetch;
  global.fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    headers.set("bypass-tunnel-reminder", "true");
    return _fetch(input, { ...init, headers });
  };
}
