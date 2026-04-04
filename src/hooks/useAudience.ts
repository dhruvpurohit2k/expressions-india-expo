import { useQuery } from "@tanstack/react-query";
import { fetchAudience } from "../api/fetchAudience";
import { queryKeys } from "../lib/queryKeys";

export function useAudience(name: string) {
  return useQuery({
    queryKey: queryKeys.audience.detail(name),
    queryFn: () => fetchAudience(name),
    enabled: !!name,
  });
}
