import { useQuery } from "@tanstack/react-query";
import { fetchArticlesByAudience } from "../api/fetchArticlesByAudience";
import { queryKeys } from "../lib/queryKeys";

export function useArticlesByAudience({
  audience,
  limit,
  offset,
  enabled = true,
}: {
  audience: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.audience.articles(audience, { limit, offset }),
    queryFn: () => fetchArticlesByAudience({ audience, limit, offset }),
    enabled: !!audience && enabled,
  });
}
