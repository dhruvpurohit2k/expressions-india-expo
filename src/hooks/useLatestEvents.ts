import { useQuery } from "@tanstack/react-query";
import { fetchLatestEvents } from "../api/fetchLatestEvents";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useLatestEvents({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.events.all(),
    queryFn: fetchLatestEvents,
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
    enabled,
  });
}
