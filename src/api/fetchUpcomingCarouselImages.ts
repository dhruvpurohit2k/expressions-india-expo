import { API_URL } from "../lib/config";
import { safeJson } from "../utils/api";
export async function fetchUpcomingCarouselImages(): Promise<string[]> {
  const response = await fetch(
    `${API_URL}/home/upcoming-images`,
  );
  const json = await safeJson(response);

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  return (json.data as string[]) ?? [];
}
