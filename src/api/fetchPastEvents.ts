import { API_URL } from "../lib/config";
import z from "zod";
import { EventListItemSchema } from "../types/event";
import { ApiMeta } from "../utils/api";

export type PastEventsResponse = {
  data: z.infer<typeof EventListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchPastEventList({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}): Promise<PastEventsResponse> {
  const response = await fetch(
    `${API_URL}/event/past?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(EventListItemSchema).safeParse(json.data ?? []);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return {
    data: parsed.data,
    meta: json.meta ?? undefined,
  };
}
