import { z } from "zod";
import { API_URL } from "../lib/config";
import { safeJson } from "../utils/api";

const BrochureItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnailUrl: z.string().nullable(),
  pdfUrl: z.string().nullable(),
});

export type BrochureItem = z.infer<typeof BrochureItemSchema>;

export async function fetchBrochure(): Promise<BrochureItem | null> {
  const response = await fetch(`${API_URL}/brochure?limit=1&offset=0`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const json = await safeJson(response);

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(BrochureItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);

  return parsed.data[0] ?? null;
}
