import { API_URL } from "../lib/config";
import { CourseDetailSchema, CourseDetail } from "../types/course";
import { safeJson } from "../utils/api";

export async function fetchCourse(id: string): Promise<CourseDetail> {
  const response = await fetch(
    `${API_URL}/course/${id}`,
  );
  const json = await safeJson(response);

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = CourseDetailSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
