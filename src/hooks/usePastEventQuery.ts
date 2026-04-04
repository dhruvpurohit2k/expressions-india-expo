import { useQuery } from "@tanstack/react-query";
import { fetchPastEventList } from "../api/fetchPastEvents";
import { queryKeys } from "../lib/queryKeys";

export function usePastEventQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.events.past({ limit, offset }),
    queryFn: () => fetchPastEventList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
