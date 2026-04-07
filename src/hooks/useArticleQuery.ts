import { useQuery } from "@tanstack/react-query";
import { fetchArticleList } from "../api/fetchArticles";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

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
    refetchInterval: refreshTime,
  });
}
