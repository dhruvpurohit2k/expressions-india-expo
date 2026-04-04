import { useQuery } from "@tanstack/react-query";
import { fetchArticle } from "../api/fetchArticle";
import { queryKeys } from "../lib/queryKeys";

export function useArticle(id: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(id),
    queryFn: () => fetchArticle(id),
    enabled: !!id,
  });
}
