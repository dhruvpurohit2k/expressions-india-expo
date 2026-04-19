import { API_URL } from "../lib/config";
import z from "zod";
import { ArticleListItemSchema } from "../types/article";
import type { ApiMeta } from "../utils/api";

export type ArticlesByAudienceResponse = {
  data: z.infer<typeof ArticleListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchArticlesByAudience({
  audience,
  limit,
  offset,
}: {
  audience: string;
  limit?: number;
  offset?: number;
}): Promise<ArticlesByAudienceResponse> {
  const response = await fetch(
    `${API_URL}/article/audience/${audience}?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");
  const parsed = z.array(ArticleListItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return { data: parsed.data, meta: json.meta ?? undefined };
}
