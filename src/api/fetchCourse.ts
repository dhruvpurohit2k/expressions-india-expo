import { CourseDetailSchema, CourseDetail } from "../types/course";

export async function fetchCourse(id: string): Promise<CourseDetail> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/course/${id}`,
  );
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = CourseDetailSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
