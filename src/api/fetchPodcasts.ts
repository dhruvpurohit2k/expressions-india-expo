import { API_URL } from "../lib/config";
import z from "zod";
import { PodcastListItemSchema } from "../types/podcast";
import { ApiMeta } from "../utils/api";

export type PodcastsResponse = {
  data: z.infer<typeof PodcastListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchPodcastList({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}): Promise<PodcastsResponse> {
  const response = await fetch(
    `${API_URL}/podcast?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(PodcastListItemSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return {
    data: parsed.data,
    meta: json.meta ?? undefined,
  };
}
