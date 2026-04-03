import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../api/fetchEvent";

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
