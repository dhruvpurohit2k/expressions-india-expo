import { View, Text, ScrollView, Pressable } from "react-native";
import { styleFactory } from "../styleFactory";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import z, { uuidv7 } from "zod";
import { theme } from "../theme";

export default function UpcomingEvents() {
  const globalStyle = styleFactory();
  const { data: upcomingEvents, isLoading } = useGetUpcomingEvents();
  return (
    <View style={[]}>
      <Text style={globalStyle.sectionHeading}>Upcoming Events</Text>
      {isLoading ? (
        <View style={[globalStyle.container, { height: 300, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#ccc" }]}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          style={[
            globalStyle.container,
            {
              gap: 10,
              height: 300,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#ccc",
            },
          ]}
        >
          {upcomingEvents?.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`} asChild>
              <Pressable>
                <View
                  style={[
                    {
                      backgroundColor: "white",
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: "#ccc",
                    },
                  ]}
                >
                  <View>
                    <Text>{event.title}</Text>
                    <View>
                      <Text
                        style={[
                          {
                            textAlign: "right",
                            marginTop: 3,
                            color: "#888888",
                          },
                        ]}
                      >
                        {formatDateRange(event.startDate, event.endDate)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const UpcomingEventSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
});

async function fetchUpcomingEvents() {
  try {
    const response = await fetch("http://192.168.1.12:5000/event/upcoming");
    const data = await response.json();
    return z.array(UpcomingEventSchema).parse(data);
  } catch (error) {
    throw error;
  }
}

function useGetUpcomingEvents() {
  return useQuery({
    queryKey: ["upcoming-events"],
    queryFn: fetchUpcomingEvents,
    retry: 3,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  });
}
function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateRange(startDate: Date, endDate: Date | null) {
  if (!endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
