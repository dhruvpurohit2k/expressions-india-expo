import { useQuery } from "@tanstack/react-query";
import { fetchPodcast } from "../api/fetchPodcast";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function usePodcast(id: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.podcasts.detail(id),
    queryFn: () => fetchPodcast(id),
    enabled: !!id && enabled,
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
  });
}
