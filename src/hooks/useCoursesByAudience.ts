import { useQuery } from "@tanstack/react-query";
import { fetchCoursesByAudience } from "../api/fetchCoursesByAudience";
import { queryKeys } from "../lib/queryKeys";

export function useCoursesByAudience({
  audience,
  limit,
  offset,
  enabled = true,
}: {
  audience: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.audience.courses(audience, { limit, offset }),
    queryFn: () => fetchCoursesByAudience({ audience, limit, offset }),
    enabled: !!audience && enabled,
  });
}
