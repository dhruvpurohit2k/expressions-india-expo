import { useState, useEffect } from "react";
import { EventListItem, EventListItemSchema } from "../types";
import z from "zod";

// Define the hook function (e.g., useFetch) that uses useState/useEffect
export function useLatestEvents() {
  const [data, setData] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/event`)
      .then((res) => res.json())
      .then((json) => {
        setData(z.array(EventListItemSchema).parse(json));
        setLoading(false);
      })
      .catch((err) => setError(err));
  }, []);

  return { data, loading, error };
}
