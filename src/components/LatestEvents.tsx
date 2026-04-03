import { View, Text, Pressable, StyleSheet } from "react-native";
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
      <View style={[{ gap: 5, paddingVertical: 10 }]}>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              elevation: 1,
              padding: 5,
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, styles.text, { fontSize: 14 }]}>
            International Young Film Makers Festival{" "}
          </Text>
          <Text
            style={[
              globalStyle.text,
              {
                fontSize: 13,
                color: theme.red,
                alignSelf: "flex-end",
                marginVertical: 0,
              },
            ]}
          >
            25 Apr 26
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              elevation: 1,
              padding: 5,
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, styles.text, { fontSize: 14 }]}>
            MINDSMART
          </Text>
          <Text
            style={[
              globalStyle.text,
              {
                fontSize: 13,
                color: theme.red,
                alignSelf: "flex-end",
                marginVertical: 0,
              },
            ]}
          >
            1st May 26
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              elevation: 1,
              padding: 5,
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, styles.text, { fontSize: 14 }]}>
            POSCSO Act, Child & Adoescent Wellbeing
          </Text>
          <Text
            style={[
              globalStyle.text,
              {
                fontSize: 13,
                alignSelf: "flex-end",
                color: theme.red,
                marginVertical: 0,
              },
            ]}
          >
            1st May 26
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColorLight,
              elevation: 1,
              padding: 5,
              borderRadius: 5,
            },
          ]}
        >
          <Text style={[globalStyle.text, styles.text, { fontSize: 14 }]}>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    backgroundColor: "#hsla(0, 0%, 98%,1)",
    borderRadius: 10,
    // elevation: 1,
    // borderWidth: 1,
    // borderColor: theme.backgroundColorDark,
  },
  text: {
    color: theme.text,
  },
});
