import { useQuery } from "@tanstack/react-query";
import { fetchCompletedCarouselImages } from "../api/fetchCompletedCarouselImages";
import { queryKeys } from "../lib/queryKeys";

const refreshTime = Number(process.env.EXPO_PUBLIC_REFRESH_TIME) || 60_000;

export function useCompletedCarouselImages({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.homeImages.completed(),
    queryFn: fetchCompletedCarouselImages,
    enabled,
  });
}
