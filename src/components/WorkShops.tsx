import { View, Text, ScrollView, Pressable } from "react-native";
import { styleFactory } from "../styleFactory";

import {
  workshopsOffered,
  Workshop,
  WorkshopsOffered,
} from "@/data/workshops/workshops";
import { theme } from "../theme";
import { useState } from "react";
export default function WorkShops() {
  const globalStyle = styleFactory();
  const [openedWorkShopType, setOpenedWorkShopType] = useState<number>(0);
  return (
    <ScrollView>
      <Text style={globalStyle.sectionHeading}>WORKSHOPS</Text>
      {workshopsOffered.map((workshopType, index) => {
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
                    elevation: 5,
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
                  {workshopType.type}
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
                  elevation: 2,
                  gap: 10,
                }}
              >
                {workshopType.listOfWorkshops.map((workshop, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        {
                          backgroundColor: theme.backgroundColorLight,
                          paddingHorizontal: 10,
                          paddingVertical: 2,
                          borderRadius: 5,
                          elevation: 1,
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
                      <Text
                        style={[
                          {
                            color: "hsl(0, 0%, 50%)",
                            fontSize: 14,
                          },
                        ]}
                      >
                        {workshop.extras}
                      </Text>
                      <Text
                        style={[{ color: "hsl(0, 0%, 60%)", fontSize: 12 }]}
                      >
                        {workshop.date}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
