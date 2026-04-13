import { z } from "zod";

export const CourseListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  audiences: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CourseListItem = z.infer<typeof CourseListItemSchema>;

const CourseMediaSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  fileType: z.string(),
});

// Summary returned as part of the course overview (no paid content).
const CourseChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  isFree: z.boolean(),
});

// Full chapter data returned by the single-chapter endpoint.
export const CourseChapterDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  videoLinkUrl: z.string(),
  isFree: z.boolean(),
  downloadableContent: z.array(CourseMediaSchema).nullish().transform((v) => v ?? []),
});

export const CourseDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnail: CourseMediaSchema.nullable().optional(),
  introductionVideoUrl: z.string().default(""),
  downloadableContent: z.array(CourseMediaSchema).nullish().transform((v) => v ?? []),
  audiences: z.array(z.string()).nullish().transform((v) => v ?? []),
  chapters: z.array(CourseChapterSchema).nullish().transform((v) => v ?? []),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CourseMedia = z.infer<typeof CourseMediaSchema>;
export type CourseChapter = z.infer<typeof CourseChapterSchema>;
export type CourseChapterDetail = z.infer<typeof CourseChapterDetailSchema>;
export type CourseDetail = z.infer<typeof CourseDetailSchema>;
