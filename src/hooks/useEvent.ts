import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../api/fetchEvent";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: !!id,
    refetchInterval: refreshTime,
  });
}
