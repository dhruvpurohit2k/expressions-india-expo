import { z } from "zod";

export const EventListItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
});
export const EventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  registrationLink: z.url().nullable(),
  mediaLink: z.array(z.url()),
});
export type EventListItem = z.infer<typeof EventListItemSchema>;
export type EventItem = z.infer<typeof EventSchema>;
