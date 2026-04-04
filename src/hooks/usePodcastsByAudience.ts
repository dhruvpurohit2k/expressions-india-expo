import { useQuery } from "@tanstack/react-query";
import { fetchPodcastsByAudience } from "../api/fetchPodcastsByAudience";
import { queryKeys } from "../lib/queryKeys";

export function usePodcastsByAudience({
  audience,
  limit,
  offset,
}: {
  audience: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.audience.podcasts(audience, { limit, offset }),
    queryFn: () => fetchPodcastsByAudience({ audience, limit, offset }),
    enabled: !!audience,
  });
}
