import { API_URL } from "../lib/config";
import z from "zod";
import { ArticleListItemSchema } from "../types/article";
import { ApiMeta, safeJson } from "../utils/api";

export type ArticlesResponse = {
  data: z.infer<typeof ArticleListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchArticleList({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}): Promise<ArticlesResponse> {
  const response = await fetch(
    `${API_URL}/article?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await safeJson(response);

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(ArticleListItemSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return {
    data: parsed.data,
    meta: json.meta ?? undefined,
  };
}
