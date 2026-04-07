export async function fetchCompletedCarouselImages(): Promise<string[]> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/home/completed-images`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  return (json.data as string[]) ?? [];
}
