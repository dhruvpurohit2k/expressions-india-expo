import { useQuery } from "@tanstack/react-query";
import { fetchJournal } from "../api/fetchJournal";

export function useJournal(id: string) {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => fetchJournal(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
