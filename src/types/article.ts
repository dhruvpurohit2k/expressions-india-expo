import { z } from "zod";

export const ArticleListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  createdAt: z.coerce.date().nullable().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
  publishedAt: z.coerce.date(),
});
export type ArticleListItem = z.infer<typeof ArticleListItemSchema>;

export const ArticleDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  audience: z.array(z.object({ name: z.string() })).default([]),
  medias: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        name: z.string(),
        fileType: z.string(),
      }),
    )
    .default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ArticleDetail = z.infer<typeof ArticleDetailSchema>;
