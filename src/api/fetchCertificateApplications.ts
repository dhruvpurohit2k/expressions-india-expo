import { z } from "zod";
import { API_URL } from "../lib/config";

export const CertApplicationPublicSchema = z.object({
  id: z.string(),
  isOpen: z.boolean(),
  formUrl: z.string().nullable().optional(),
  message: z.string().optional(),
  openFrom: z.coerce.date().nullable().optional(),
  openUntil: z.coerce.date().nullable().optional(),
});

export type CertApplicationPublic = z.infer<typeof CertApplicationPublicSchema>;

export async function fetchCertificateApplications(): Promise<CertApplicationPublic[]> {
  const response = await fetch(`${API_URL}/certificate-application`);
  const json = await response.json();
  if (!json.success) throw new Error(json.error?.message ?? "Request failed");
  const parsed = z.array(CertApplicationPublicSchema).safeParse(json.data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
}
