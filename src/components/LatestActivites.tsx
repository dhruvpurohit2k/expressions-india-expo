import { View, Text, Pressable } from "react-native";
import { theme } from "../theme";
import { styleFactory } from "../styleFactory";
import { latestActivites } from "../../data/home";
import * as Linking from "expo-linking";

export default function LatestActivites() {
  const globalStyle = styleFactory();
  return (
    <View
      style={[
        globalStyle.container,
        {
          elevation: 5,
          backgroundColor: theme.backgroundColor,
          borderRadius: 10,
        },
      ]}
    >
      <Text style={[globalStyle.sectionHeading]}>Latest Activites</Text>
      {latestActivites.map((item, idx) => (
        <View key={idx} style={{ marginVertical: 5 }}>
          <Pressable
            onPress={() => {
              Linking.openURL(item.link);
            }}
          >
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
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
