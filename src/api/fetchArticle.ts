import { API_URL } from "../lib/config";
import { ArticleDetailSchema } from "../types/article";
import type { ArticleDetail } from "../types/article";
import { safeJson } from "../utils/api";

export async function fetchArticle(id: string): Promise<ArticleDetail> {
  const response = await fetch(
    `${API_URL}/article/${id}`,
  );
  const json = await safeJson(response);

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = ArticleDetailSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
