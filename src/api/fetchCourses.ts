import { API_URL } from "../lib/config";
import { z } from "zod";
import { CourseListItemSchema } from "../types/course";
import { ApiMeta, safeJson } from "../utils/api";

export type CoursesResponse = {
  data: z.infer<typeof CourseListItemSchema>[];
  meta?: ApiMeta;
};

export type CourseListParams = {
  limit?: number;
  offset?: number;
  search?: string;
  audiences?: string; // comma-separated audience names
  sortField?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export async function fetchCourseList(
  params: CourseListParams = {},
): Promise<CoursesResponse> {
  const { limit = 12, offset = 0, search, audiences, sortField, sortOrder } = params;

  const query = new URLSearchParams();
  query.set("limit", String(limit));
  query.set("offset", String(offset));
  if (search) query.set("search", search);
  if (audiences) query.set("audiences", audiences);
  if (sortField) query.set("sortField", sortField);
  if (sortOrder) query.set("sortOrder", sortOrder);

  const response = await fetch(
    `${API_URL}/course?${query.toString()}`,
  );
  const json = await safeJson(response);

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = z.array(CourseListItemSchema).safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return {
    data: parsed.data,
    meta: json.meta ?? undefined,
  };
}
