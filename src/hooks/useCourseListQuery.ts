import { useQuery } from "@tanstack/react-query";
import { fetchCourseList, type CourseListParams } from "../api/fetchCourses";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useCourseListQuery({
  enabled = true,
  ...params
}: CourseListParams & { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.courses.list(params),
    queryFn: () => fetchCourseList(params),
    enabled,
  });
}
