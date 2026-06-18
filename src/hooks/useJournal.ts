import { useQuery } from "@tanstack/react-query";
import { fetchJournal } from "../api/fetchJournal";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useJournal(id: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.journals.detail(id),
    queryFn: () => fetchJournal(id),
    enabled: !!id && enabled,
  });
}
