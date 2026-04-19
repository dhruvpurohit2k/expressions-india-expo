import { z } from "zod";
import { API_URL } from "../lib/config";

const AlmanacItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnailUrl: z.string().nullable(),
  pdfUrl: z.string().nullable(),
});

export type AlmanacItem = z.infer<typeof AlmanacItemSchema>;

export async function fetchAlmanac(): Promise<AlmanacItem | null> {
  const response = await fetch(`${API_URL}/almanac?limit=1&offset=0`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(AlmanacItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);

  return parsed.data[0] ?? null;
}
