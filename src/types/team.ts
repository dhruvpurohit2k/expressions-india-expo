import { z } from "zod";

export const MemberSchema = z.object({
  id: z.string(),
  position: z.string(),
  holders: z.array(z.string()),
});

export const TeamSchema = z.object({
  id: z.string(),
  description: z.string(),
  members: z.array(MemberSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Member = z.infer<typeof MemberSchema>;
export type Team = z.infer<typeof TeamSchema>;
