import { CourseChapterDetailSchema, CourseChapterDetail } from "../types/course";
import { getToken } from "../lib/auth";

/** Thrown when the backend returns 401 (not logged in) or 403 (not enrolled). */
export class AccessError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
    this.name = "AccessError";
  }
}

export async function fetchChapter(
  courseId: string,
  chapterId: string,
): Promise<CourseChapterDetail> {
  const token = await getToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/course/${courseId}/chapter/${chapterId}`,
    { headers },
  );

  if (response.status === 401) {
    throw new AccessError(401, "Login required to access this chapter");
  }
  if (response.status === 403) {
    throw new AccessError(403, "Purchase this course to access this chapter");
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = CourseChapterDetailSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
