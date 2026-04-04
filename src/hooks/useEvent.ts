import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../api/fetchEvent";
import { queryKeys } from "../lib/queryKeys";

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
