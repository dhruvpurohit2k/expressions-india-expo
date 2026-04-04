import { useQuery } from "@tanstack/react-query";
import { fetchArticleList } from "../api/fetchArticles";
import { queryKeys } from "../lib/queryKeys";

export function useArticleQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.articles.list({ limit, offset }),
    queryFn: () => fetchArticleList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
