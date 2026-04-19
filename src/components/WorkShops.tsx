import { API_URL } from "../lib/config";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
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
import { useIsFocused } from "@react-navigation/native";
import { Link, router } from "expo-router";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated";
export default function WorkShops() {
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const [openedWorkShopType, setOpenedWorkShopType] = useState<number>(-1);
  const { data: workshops, isLoading, error } = useWorkshopsQuery(isFocused);
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!workshops) return null;
  return (
    <ScrollView>
      <Text style={globalStyle.sectionHeading}>WORKSHOPS</Text>
      {Object.entries(workshops.data).map(
        ([workshopType, workshopList], index) => {
          return (
            <Animated.View
              key={index}
              entering={FadeInUp.duration(250).delay(200)}
            >
              <Pressable
                onPress={() => {
                  setOpenedWorkShopType((i) => (i === index ? -1 : index));
                }}
              >
                <Animated.View
                  entering={FadeInUp.duration(500).delay(50)}
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
                </Animated.View>
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
                        onPress={() => {
                          // TODO: Create /app/workshop/[id].tsx route for workshop details
                          Alert.alert("Coming Soon", "Workshop details page is under development");
                        }}
                      >
                        <Animated.View
                          entering={FadeInUp.duration(250).delay(index * 100)}
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
                        </Animated.View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          );
        },
      )}
    </ScrollView>
  );
}

async function fetchWorkshops() {
  try {
    const response = await fetch(`${API_URL}/workshop`);
    const data = await response.json();
    return WorkshopListSchema.parse(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const useWorkshopsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: fetchWorkshops,
    retry: 3,
    enabled,
  });
};
