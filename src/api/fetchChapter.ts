import { API_URL } from "../lib/config";
import { CourseChapterDetailSchema, CourseChapterDetail } from "../types/course";
import { getToken } from "../lib/auth";
import { tryRefresh } from "./refresh";
import { safeJson } from "../utils/api";

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
  const url = `${API_URL}/course/${courseId}/chapter/${chapterId}`;

  const makeRequest = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(url, { headers });
  };

  let token = await getToken();
  let response = await makeRequest(token);

  // Access token expired — try a silent refresh once, then retry
  if (response.status === 401) {
    const newToken = await tryRefresh();
    if (!newToken) {
      throw new AccessError(401, "Login required to access this chapter");
    }
    response = await makeRequest(newToken);
  }

  if (response.status === 401) {
    throw new AccessError(401, "Login required to access this chapter");
  }
  if (response.status === 403) {
    throw new AccessError(403, "Purchase this course to access this chapter");
  }

  const json = await safeJson(response);
  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  const parsed = CourseChapterDetailSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
