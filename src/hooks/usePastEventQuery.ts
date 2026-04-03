import { useQuery } from "@tanstack/react-query";
import { fetchPastEventList } from "../api/fetchPastEvents";

export function usePastEventQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["past-events", limit, offset],
    queryFn: () => fetchPastEventList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
