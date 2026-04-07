import { useQuery } from "@tanstack/react-query";
import { fetchJournalList } from "../api/fetchJournals";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useJournalQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.journals.list({ limit, offset }),
    queryFn: () => fetchJournalList({ limit, offset }),
    refetchInterval: refreshTime,
  });
}
