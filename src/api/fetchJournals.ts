import z from "zod";
import { JournalListItemSchema } from "../types/journal";
import { ApiMeta } from "../utils/api";

export type JournalsResponse = {
  data: z.infer<typeof JournalListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchJournalList({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}): Promise<JournalsResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/journal?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(JournalListItemSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return {
    data: parsed.data,
    meta: json.meta ?? undefined,
  };
}
