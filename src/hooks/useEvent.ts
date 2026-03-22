import { useEffect, useState } from "react";
import { EventItem, EventSchema } from "../types";

export function useEvent(id: string) {
  const [data, setData] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://192.168.1.12:5000/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(EventSchema.parse(data));
        setLoading(false);
      })
      .catch((err) => {
        setErr(err);
        setLoading(false);
      });
  }, [id]);

  return { data, loading, err };
}
