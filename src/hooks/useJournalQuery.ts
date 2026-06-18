import { useQuery } from "@tanstack/react-query";
import { fetchJournalList } from "../api/fetchJournals";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useJournalQuery({
  limit,
  offset,
  enabled = true,
}: {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.journals.list({ limit, offset }),
    queryFn: () => fetchJournalList({ limit, offset }),
    enabled,
  });
}
