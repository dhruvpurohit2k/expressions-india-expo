import { z } from "zod";

// export const EventListItemSchema = z.object({
//   id: z.uuid(),
//   title: z.string(),
//   startDate: z.coerce.date(),
//   endDate: z.coerce.date().nullable(),
// });
// export const EventSchema = z.object({
//   id: z.uuid(),
//   title: z.string(),
//   description: z.string(),
//   startDate: z.coerce.date(),
//   endDate: z.coerce.date().nullable(),
//   registrationLink: z.url().nullable(),
//   mediaLink: z.array(z.url()),
// });
// export type EventListItem = z.infer<typeof EventListItemSchema>;
// export type EventItem = z.infer<typeof EventSchema>;

export const UpcomingEventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  registrationLink: z.url().nullable(),
  mediaLink: z.array(z.url()),
  location: z.string().nullable(),
  description: z.string().nullable(),
  isPaid: z.boolean(),
  price: z.number().nullable(),
});

export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;

export const UploadedMediaSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  perks: z.array(z.string()).nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  location: z.string(),
  isPaid: z.boolean(),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
  price: z.number().int().nullable().optional(),
  uploadedMedia: z.array(UploadedMediaSchema).nullable().default([]),
  registrationLink: z.string().nullable().optional(),
});

export type Event = z.infer<typeof EventSchema>;

export const WorkshopListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable().optional(),
});
export const WorkshopListSchema = z.object({
  data: z.record(z.string(), z.array(WorkshopListItemSchema)),
});
export type WorkshopList = z.infer<typeof WorkshopListSchema>;
export type WorkshopListItem = z.infer<typeof WorkshopListItemSchema>;

export const WorkshopSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  perks: z.array(z.string()).nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  isPaid: z.boolean(),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
  price: z.number().int().nullable().optional(),
  uploadedMedia: z.array(UploadedMediaSchema).nullable().default([]),
  registrationLink: z.string().nullable().optional(),
});

export type Workshop = z.infer<typeof WorkshopSchema>;
