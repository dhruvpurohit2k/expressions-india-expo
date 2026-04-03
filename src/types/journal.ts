import { z } from "zod";

export const JournalListItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  volume: z.number(),
  issue: z.number(),
  startMonth: z.string(),
  endMonth: z.string(),
  year: z.number(),
});

export type JournalListItem = z.infer<typeof JournalListItemSchema>;

const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  fileType: z.string(),
});

const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const JournalChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  media: MediaSchema.nullable(),
  authors: z.array(AuthorSchema),
});

export const JournalSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  startMonth: z.string(),
  endMonth: z.string(),
  year: z.number(),
  volume: z.number(),
  issue: z.number(),
  media: MediaSchema.nullable(),
  chapters: z.array(JournalChapterSchema),
});

export type Journal = z.infer<typeof JournalSchema>;
