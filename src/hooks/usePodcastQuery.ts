import { useQuery } from "@tanstack/react-query";
import { fetchPodcastList } from "../api/fetchPodcasts";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function usePodcastQuery({
  limit,
  offset,
  enabled = true,
}: {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.podcasts.list({ limit, offset }),
    queryFn: () => fetchPodcastList({ limit, offset }),
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
    enabled,
  });
}
