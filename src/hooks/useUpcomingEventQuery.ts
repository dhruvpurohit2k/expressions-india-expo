import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingEventList } from "../api/fetchUpcomingEvents";
import { queryKeys } from "../lib/queryKeys";

export function useUpcomingEventQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.events.upcoming({ limit, offset }),
    queryFn: () => fetchUpcomingEventList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
