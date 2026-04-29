import { z } from "zod";
import { API_URL } from "../lib/config";
import { CourseListItemSchema } from "../types/course";
import { getToken } from "../lib/auth";
import { tryRefresh } from "./refresh";
import { safeJson } from "../utils/api";

export async function fetchMyCourses(): Promise<z.infer<typeof CourseListItemSchema>[]> {
  const makeRequest = async (token: string | null) => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_URL}/course/my`, { headers });
  };

  let token = await getToken();
  let response = await makeRequest(token);

  if (response.status === 401) {
    const newToken = await tryRefresh();
    if (!newToken) throw new Error("Login required");
    response = await makeRequest(newToken);
  }

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const json = await safeJson(response);
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");

  const parsed = z.array(CourseListItemSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);

  return parsed.data;
}
