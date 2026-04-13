import { useQuery } from "@tanstack/react-query";
import { fetchPastEventList } from "../api/fetchPastEvents";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function usePastEventQuery({
  limit,
  offset,
  enabled = true,
}: {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.events.past({ limit, offset }),
    queryFn: () => fetchPastEventList({ limit, offset }),
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
    enabled,
  });
}
