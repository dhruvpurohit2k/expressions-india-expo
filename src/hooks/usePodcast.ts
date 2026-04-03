import { useQuery } from "@tanstack/react-query";
import { fetchPodcast } from "../api/fetchPodcast";

export function usePodcast(id: string) {
  return useQuery({
    queryKey: ["podcast", id],
    queryFn: () => fetchPodcast(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
