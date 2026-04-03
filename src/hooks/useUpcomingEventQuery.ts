import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingEventList } from "../api/fetchUpcomingEvents";

export function useUpcomingEventQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["upcoming-events", limit, offset],
    queryFn: () => fetchUpcomingEventList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
