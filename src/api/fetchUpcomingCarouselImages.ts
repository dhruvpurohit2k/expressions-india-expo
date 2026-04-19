import { API_URL } from "../lib/config";
export async function fetchUpcomingCarouselImages(): Promise<string[]> {
  const response = await fetch(
    `${API_URL}/home/upcoming-images`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  return (json.data as string[]) ?? [];
}
