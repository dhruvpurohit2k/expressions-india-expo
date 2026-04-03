import { z } from "zod";

export const EventListItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  isOnline: z.boolean(),
  isPaid: z.boolean(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  thumbnailUrl: z.string().nullable().optional(),
});

export type EventListItem = z.infer<typeof EventListItemSchema>;

const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  fileType: z.string().optional().default(""),
});

const LinkSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  perks: z.array(z.string()).nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  isOnline: z.boolean(),
  isPaid: z.boolean(),
  price: z.number().int().nullable().optional(),
  status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
  registrationUrl: z.string().nullable().optional(),
  promotionalMedia: z.array(MediaSchema).default([]),
  promotionalVideoLinks: z.array(LinkSchema).default([]),
  medias: z.array(MediaSchema).default([]),
  documents: z.array(MediaSchema).default([]),
  videoLinks: z.array(LinkSchema).default([]),
  audiences: z.array(z.string()).default([]),
  thumbnail: MediaSchema.nullable().optional(),
});

export type Event = z.infer<typeof EventSchema>;
