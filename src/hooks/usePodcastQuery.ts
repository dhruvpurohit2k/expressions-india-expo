import { useQuery } from "@tanstack/react-query";
import { fetchPodcastList } from "../api/fetchPodcasts";
import { queryKeys } from "../lib/queryKeys";

export function usePodcastQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.podcasts.list({ limit, offset }),
    queryFn: () => fetchPodcastList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
