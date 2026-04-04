import z from "zod";
import { EventListItemSchema } from "../types/event";
import type { ApiMeta } from "../utils/api";

export type EventsByAudienceResponse = {
  data: z.infer<typeof EventListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchEventsByAudience({
  audience,
  limit,
  offset,
}: {
  audience: string;
  limit?: number;
  offset?: number;
}): Promise<EventsByAudienceResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/event/audience/${audience}?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");
  const parsed = z.array(EventListItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return { data: parsed.data, meta: json.meta ?? undefined };
}
