import z from "zod";
import { LatestFeedItemSchema } from "../types/latestFeed";

export async function fetchLatestFeed(): Promise<z.infer<typeof LatestFeedItemSchema>[]> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/latest-activity`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(LatestFeedItemSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
