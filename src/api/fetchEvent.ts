import { parseApiResponse } from "../utils/api";
import { EventSchema, Event } from "../types/event";

export async function fetchEvent(id: string): Promise<Event | null> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/event/${id}`,
  );
  return parseApiResponse(response, EventSchema);
}
