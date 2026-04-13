import { z } from "zod";
import { TeamSchema } from "../types/team";

export async function fetchTeams(): Promise<z.infer<typeof TeamSchema>[]> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/team`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(TeamSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
