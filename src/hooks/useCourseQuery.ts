import { useQuery } from "@tanstack/react-query";
import { fetchCourse } from "../api/fetchCourse";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useCourseQuery(id: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: !!id && enabled,
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
  });
}
