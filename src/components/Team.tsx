import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { styleFactory } from "../styleFactory";
import { theme } from "../theme";
import { useTeamListQuery } from "../hooks/useTeamListQuery";
import { useIsFocused } from "@react-navigation/native";

export default function Team() {
  const globalStyle = styleFactory();
  const isFocused = useIsFocused();
  const {
    data: teams,
    isLoading,
    error,
  } = useTeamListQuery({ enabled: isFocused });

  const team = teams?.[0];

  return (
    <ScrollView style={[globalStyle.screen, { paddingHorizontal: 20 }]}>
      {/*<Text style={[globalStyle.sectionHeading]}>Our Team</Text>*/}

      {isLoading && (
        <ActivityIndicator
          size="large"
          color={theme.red}
          style={{ marginTop: 32 }}
        />
      )}

      {error && (
        <Text
          style={[
            globalStyle.text,
            { color: theme.red, textAlign: "center", marginTop: 24 },
          ]}
        >
          Failed to load team data.
        </Text>
      )}

      {team && (
        <>
          {team.description ? (
            <Text style={[globalStyle.text]}>{team.description}</Text>
          ) : null}

          {team.members.length > 0 && (
            <View
              style={[
                globalStyle.container,
                {
                  backgroundColor: theme.backgroundColorLight,
                  elevation: 2,
                  borderRadius: 10,
                  gap: 0,
                  marginTop: 16,
                  marginBottom: 20,
                  padding: 0,
                  overflow: "hidden",
                },
              ]}
            >
              {team.members.map((member, index) => (
                <View
                  key={member.id}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    padding: 14,
                    borderBottomWidth: index < team.members.length - 1 ? 1 : 0,
                    borderBottomColor: "#22222222",
                  }}
                >
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        globalStyle.text,
                        { textAlign: "left", fontSize: 14 },
                      ]}
                    >
                      {member.position}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    {member.holders.map((holder, hi) => (
                      <Text
                        key={hi}
                        style={[
                          globalStyle.text,
                          { textAlign: "left", fontSize: 14 },
                        ]}
                      >
                        {holder}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
