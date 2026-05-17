import { z } from "zod";

export const AudienceSchema = z.object({
  ID: z.number(),
  name: z.string(),
  introduction: z.string(),
});

export type Audience = z.infer<typeof AudienceSchema>;

export const AUDIENCE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  parent: "Parents And Family",
  counselor: "Counselor (School and University)",
  head_of_department: "Head of Institute",
  mental_health_professional: "Mental Health Professional & Others",
};
