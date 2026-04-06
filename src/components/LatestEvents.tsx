import { View, Text } from "react-native";
import { theme } from "../theme";

const lightRed = "hsl(4, 65%, 50%)";
import { CalendarDays } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const events = [
  { title: "International Young Film Makers Festival", date: "25 Apr '26" },
  { title: "MINDSMART", date: "1 May '26" },
  { title: "POCSO Act, Child & Adolescent Wellbeing", date: "1 May '26" },
  {
    title: "First Aid, CPR Training & Emergency Care in Schools & Universities",
    date: null,
  },
];

export default function LatestEvents() {
  return (
    <View style={{ paddingHorizontal: 15, marginTop: 24, marginBottom: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            width: 4,
            height: 22,
            backgroundColor: lightRed,
            borderRadius: 2,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: lightRed,
          }}
        >
          Latest Activities
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        {events.map((event, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.duration(400).delay(i * 70)}
            style={{
              backgroundColor: theme.backgroundColor,
              borderRadius: 12,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              // shadowColor: "#000",
              // shadowOffset: { width: 0, height: 1 },
              // shadowOpacity: 0.06,
              // shadowRadius: 4,
              // elevation: 2,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: lightRed,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CalendarDays size={18} color={"white"} strokeWidth={2} />
            </View>
            <Text
              style={{
                flex: 1,
                fontFamily: theme.font,
                fontSize: 14,
                color: theme.text,
                lineHeight: 20,
              }}
            >
              {event.title}
            </Text>
            {event.date && (
              <View
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: theme.fontBold,
                    color: theme.red,
                  }}
                >
                  {event.date}
                </Text>
              </View>
            )}
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
