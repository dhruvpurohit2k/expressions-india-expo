export type AlmanacItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  pdfUrl: string | null;
};

export async function fetchAlmanac(): Promise<AlmanacItem | null> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/almanac?limit=1&offset=0`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const items = json.data as AlmanacItem[] | null;
  return items?.[0] ?? null;
}
