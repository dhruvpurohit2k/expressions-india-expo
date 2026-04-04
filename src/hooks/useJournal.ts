import { useQuery } from "@tanstack/react-query";
import { fetchJournal } from "../api/fetchJournal";
import { queryKeys } from "../lib/queryKeys";

export function useJournal(id: string) {
  return useQuery({
    queryKey: queryKeys.journals.detail(id),
    queryFn: () => fetchJournal(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
