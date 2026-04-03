import { useQuery } from "@tanstack/react-query";
import { fetchJournalList } from "../api/fetchJournals";

export function useJournalQuery({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["journals", limit, offset],
    queryFn: () => fetchJournalList({ limit, offset }),
    refetchInterval: 60_000,
  });
}
