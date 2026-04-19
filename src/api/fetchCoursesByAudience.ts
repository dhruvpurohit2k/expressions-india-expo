import { API_URL } from "../lib/config";
import z from "zod";
import { CourseListItemSchema } from "../types/course";
import type { ApiMeta } from "../utils/api";

export type CoursesByAudienceResponse = {
  data: z.infer<typeof CourseListItemSchema>[] | null;
  meta?: ApiMeta;
};

export async function fetchCoursesByAudience({
  audience,
  limit,
  offset,
}: {
  audience: string;
  limit?: number;
  offset?: number;
}): Promise<CoursesByAudienceResponse> {
  const response = await fetch(
    `${API_URL}/course/audience/${audience}?limit=${limit ?? 10}&offset=${offset ?? 0}`,
  );
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");
  const parsed = z.array(CourseListItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return { data: parsed.data, meta: json.meta ?? undefined };
}
