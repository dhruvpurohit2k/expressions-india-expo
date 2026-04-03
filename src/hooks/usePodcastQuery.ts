import { useQuery } from "@tanstack/react-query";
import { fetchPodcastList } from "../api/fetchPodcasts";

export function usePodcastQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["podcasts", limit, offset],
    queryFn: () => fetchPodcastList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
