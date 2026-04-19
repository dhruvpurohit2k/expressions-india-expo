import { API_URL } from "../lib/config";
import { PodcastSchema, Podcast } from "../types/podcast";

export async function fetchPodcast(id: string): Promise<Podcast> {
  const response = await fetch(
    `${API_URL}/podcast/${id}`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = PodcastSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
