export type BrochureItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  pdfUrl: string | null;
};

export async function fetchBrochure(): Promise<BrochureItem | null> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/brochure?limit=1&offset=0`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const items = json.data as BrochureItem[] | null;
  return items?.[0] ?? null;
}
