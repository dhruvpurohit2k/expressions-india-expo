import { useQuery } from "@tanstack/react-query";
import { fetchChapter, AccessError } from "../api/fetchChapter";
import { queryKeys } from "../lib/queryKeys";

export function useChapterQuery(
  courseId: string,
  chapterId: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.courses.chapter(courseId, chapterId),
    queryFn: () => fetchChapter(courseId, chapterId),
    enabled: !!courseId && !!chapterId && enabled,
    // Never retry access errors — the user must take action (login / purchase)
    retry: (count, error) => {
      if (error instanceof AccessError) return false;
      return count < 3;
    },
    // Chapter content doesn't need real-time polling
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
  });
}
