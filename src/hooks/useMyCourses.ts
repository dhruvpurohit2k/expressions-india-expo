import { useQuery } from "@tanstack/react-query";
import { fetchMyCourses } from "../api/fetchMyCourses";
import { queryKeys } from "../lib/queryKeys";

export function useMyCourses({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.courses.my(),
    queryFn: fetchMyCourses,
    enabled,
  });
}
