import { z } from "zod";

export const LatestFeedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["event", "podcast", "article", "journal"]),
  start: z.string().nullable(),
  end: z.string().nullable(),
});

export type LatestFeedItem = z.infer<typeof LatestFeedItemSchema>;
