import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingEventList } from "../api/fetchUpcomingEvents";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

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
    refetchInterval: refreshTime,
  });
}
