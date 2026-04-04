import { AudienceSchema, type Audience } from "../types/audience";

export async function fetchAudience(name: string): Promise<Audience> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/audience/${name}`,
  );
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");
  const parsed = AudienceSchema.safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
}
