import z from "zod";

export type ApiMeta = {
  total: number;
  perPage: number;
  totalPages?: number;
};

export async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    throw new Error(`Server error (${res.status}): unexpected response`);
  }
}

export async function parseApiResponse<T>(
  response: Response,
  dataSchema: z.ZodType<T>,
): Promise<T | null> {
  const json = await safeJson(response);
  if (!json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  if (json.data === null || json.data === undefined) return null;

  const parsed = dataSchema.safeParse(json.data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
