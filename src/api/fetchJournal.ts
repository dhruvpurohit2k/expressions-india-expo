import { API_URL } from "../lib/config";
import { JournalSchema, Journal } from "../types/journal";

export async function fetchJournal(id: string): Promise<Journal> {
  const response = await fetch(
    `${API_URL}/journal/${id}`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = JournalSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
