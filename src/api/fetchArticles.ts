import z from "zod";
import { ArticleListItemSchema } from "../types/article";
import { ApiMeta } from "../utils/api";

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
    `${process.env.EXPO_PUBLIC_API_URL}/article?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();

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
