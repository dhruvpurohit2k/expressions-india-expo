import { View, Text, ScrollView, Pressable } from "react-native";
import { styleFactory } from "../styleFactory";
import { format as formatDateTime } from "date-fns";

import {
  workshopsOffered,
  Workshop,
  WorkshopsOffered,
} from "@/data/workshops/workshops";
import { theme } from "../theme";
import { useState } from "react";
import { WorkshopListSchema } from "../types";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
export default function WorkShops() {
  const globalStyle = styleFactory();
  const [openedWorkShopType, setOpenedWorkShopType] = useState<number>(0);
  const { data: workshops, isLoading, error } = useWorkshopsQuery();
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!workshops) return null;
  console.log(workshops.data);
  return (
    <ScrollView>
      <Text style={globalStyle.sectionHeading}>WORKSHOPS</Text>
      {Object.entries(workshops.data).map(
        ([workshopType, workshopList], index) => {
          return (
            <View key={index}>
              <Pressable
                onPress={() => {
                  setOpenedWorkShopType((i) => (i === index ? -1 : index));
                }}
              >
                <View
                  style={[
                    {
                      backgroundColor: theme.backgroundColor,
                      borderWidth: 1,
                      borderColor: theme.backgroundColorDark,
                      marginVertical: 5,
                      padding: 10,
                      marginHorizontal: 10,
                      borderRadius: 5,
                    },
                    openedWorkShopType === index && {
                      backgroundColor: theme.sectionHeadingColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      globalStyle.text,
                      openedWorkShopType === index && { color: "white" },
                    ]}
                  >
                    {workshopType}
                  </Text>
                </View>
              </Pressable>
              {openedWorkShopType === index && (
                <View
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: theme.backgroundColor,
                    borderRadius: 10,
                    gap: 10,
                  }}
                >
                  {workshopList.map((workshop, index) => {
                    return (
                      <Pressable
                        key={workshop.id}
                        onPress={() => router.push(`/workshop/${workshop.id}`)}
                      >
                        <View
                          style={[
                            {
                              backgroundColor: theme.backgroundColorLight,
                              // backgroundColor: theme.red,
                              width: "100%",
                              paddingHorizontal: 10,
                              paddingVertical: 2,
                              borderRadius: 5,
                              gap: 5,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              {
                                fontSize: 16,
                              },
                            ]}
                          >
                            {workshop.title}
                          </Text>
                          <View
                            style={[
                              {
                                flexDirection: "row",
                                alignSelf: "flex-end",
                                alignItems: "flex-end",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                {
                                  color: "hsl(0, 0%, 50%)",
                                  fontSize: 14,
                                },
                              ]}
                            >
                              {formatDateTime(workshop.startDate, "do MMM yy")}
                            </Text>
                            {workshop.endDate && (
                              <Text
                                style={[
                                  {
                                    color: "hsl(0, 0%, 50%)",
                                    fontSize: 14,
                                  },
                                ]}
                              >
                                {` - ${formatDateTime(workshop.endDate, "do MMM yy")}`}
                              </Text>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        },
      )}
    </ScrollView>
  );
}

async function fetchWorkshops() {
  try {
    const response = await fetch("http://192.168.1.12:5000/workshop");
    const data = await response.json();
    console.log(data);
    return WorkshopListSchema.parse(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const useWorkshopsQuery = () => {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: fetchWorkshops,
    retry: 3,
  });
};
