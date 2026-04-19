import { API_URL } from "../lib/config";
import { parseApiResponse } from "../utils/api";
import { EventSchema, Event } from "../types/event";

export async function fetchEvent(id: string): Promise<Event | null> {
  const response = await fetch(
    `${API_URL}/event/${id}`,
  );
  return parseApiResponse(response, EventSchema);
}
