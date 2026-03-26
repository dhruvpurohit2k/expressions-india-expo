import { View, Text, Pressable } from "react-native";
import { theme } from "../theme";
import { styleFactory } from "../styleFactory";
import { Month } from "../utils";
import { Link } from "expo-router";

export default function LatestEvents() {
  const globalStyle = styleFactory();
  // const { data: events, loading } = useLatestEvents();
  return (
    <View style={[globalStyle.container]}>
      <Text style={[globalStyle.sectionHeading]}>Latest Activites</Text>
      <View style={[{ gap: 2, paddingVertical: 10 }]}>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              padding: 5,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, { fontSize: 14 }]}>
            First Aid, Cpr Training & Emergencies Care in Schools & Universities
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              padding: 5,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, { fontSize: 14 }]}>
            First Aid, Cpr Training & Emergencies Care in Schools & Universities
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              padding: 5,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, { fontSize: 14 }]}>
            First Aid, Cpr Training & Emergencies Care in Schools & Universities
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              padding: 5,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, { fontSize: 14 }]}>
            First Aid, Cpr Training & Emergencies Care in Schools & Universities
          </Text>
        </View>
      </View>
      {/*{!loading &&
        events &&
        events.map((item, idx) => (
          <View key={idx} style={{ marginVertical: 5 }}>
            <Link href={`/event/${item.id}`} asChild>
              <Pressable>
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.backgroundColorLight,
                    elevation: 2,
                    backgroundColor: theme.backgroundColorLight,
                  }}
                >
                  <Text style={[globalStyle.text]}>{item.title}</Text>
                  <View
                    style={{
                      alignItems: "flex-end",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={[globalStyle.text, { fontSize: 12 }]}
                    >{`${item.startDate.getDate()} ${Month[item.startDate.getMonth()]} ${item.startDate.getFullYear()}`}</Text>
                    {item.endDate && (
                      <>
                        <Text style={[globalStyle.text, { fontSize: 12 }]}>
                          -
                        </Text>
                        <Text style={[globalStyle.text, { fontSize: 12 }]}>
                          {`${item.endDate.getDate()} ${Month[item.endDate.getMonth()]} ${item.endDate.getFullYear()}`}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </Pressable>
            </Link>
          </View>
        ))}*/}
    </View>
  );
}
