import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api/fetchTeams";
import { queryKeys } from "../lib/queryKeys";

export function useTeamListQuery() {
  return useQuery({
    queryKey: queryKeys.team.list(),
    queryFn: fetchTeams,
  });
}
