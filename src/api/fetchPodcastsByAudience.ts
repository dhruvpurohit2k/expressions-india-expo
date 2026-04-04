import z from "zod";
import { PodcastListItemSchema } from "../types/podcast";
import type { ApiMeta } from "../utils/api";

export type PodcastsByAudienceResponse = {
  data: z.infer<typeof PodcastListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchPodcastsByAudience({
  audience,
  limit,
  offset,
}: {
  audience: string;
  limit?: number;
  offset?: number;
}): Promise<PodcastsByAudienceResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/podcast/audience/${audience}?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");
  const parsed = z.array(PodcastListItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return { data: parsed.data, meta: json.meta ?? undefined };
}
