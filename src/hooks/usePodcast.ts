import { useQuery } from "@tanstack/react-query";
import { fetchPodcast } from "../api/fetchPodcast";
import { queryKeys } from "../lib/queryKeys";

export function usePodcast(id: string) {
  return useQuery({
    queryKey: queryKeys.podcasts.detail(id),
    queryFn: () => fetchPodcast(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
