import { useQuery } from "@tanstack/react-query";
import { fetchLatestFeed } from "../api/fetchLatestFeed";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useLatestFeed({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.latestFeed.all(),
    queryFn: fetchLatestFeed,
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
    enabled,
  });
}
