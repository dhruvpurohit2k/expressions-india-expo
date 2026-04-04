import { useQuery } from "@tanstack/react-query";
import { fetchEventsByAudience } from "../api/fetchEventsByAudience";
import { queryKeys } from "../lib/queryKeys";

export function useEventsByAudience({
  audience,
  limit,
  offset,
}: {
  audience: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.audience.events(audience, { limit, offset }),
    queryFn: () => fetchEventsByAudience({ audience, limit, offset }),
    enabled: !!audience,
  });
}
