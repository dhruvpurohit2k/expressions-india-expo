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
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  registrationLink: z.url().nullable(),
  mediaLink: z.array(z.url()),
  location: z.string().nullable(),
  description: z.string().nullable(),
  is_paid: z.boolean(),
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
  perks: z.record(z.string(), z.any()).nullable().optional(),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  location: z.string(),
  is_paid: z.boolean(),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
  price: z.number().int().nullable().optional(),
  uploaded_media: z.array(UploadedMediaSchema).nullable().default([]),
  registrationLink: z.string().nullable().optional(),
});

export type Event = z.infer<typeof EventSchema>;

export const WorkshopListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
});
export const WorkshopListSchema = z.object({
  data: z.record(z.string(), z.array(WorkshopListItemSchema)),
});
export type WorkshopList = z.infer<typeof WorkshopListSchema>;
export type WorkshopListItem = z.infer<typeof WorkshopListItemSchema>;
