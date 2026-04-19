import { API_URL } from "../lib/config";
import z from "zod";
import { EventListItemSchema } from "../types/event";

export async function fetchLatestEvents(): Promise<z.infer<typeof EventListItemSchema>[]> {
  const response = await fetch(`${API_URL}/event`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(EventListItemSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
