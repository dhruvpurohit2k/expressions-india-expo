import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingCarouselImages } from "../api/fetchUpcomingCarouselImages";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useUpcomingCarouselImages() {
  return useQuery({
    queryKey: queryKeys.homeImages.upcoming(),
    queryFn: fetchUpcomingCarouselImages,
    refetchInterval: refreshTime,
    refetchIntervalInBackground: false,
  });
}
