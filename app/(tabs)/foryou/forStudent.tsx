import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable, StyleSheet } from "react-native";
import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import Header from "@/src/components/Header";
import { Ionicons } from "@expo/vector-icons";

export default function ForStudent() {
  const globalStyles = styleFactory();

  const options = [
    {
      id: "certificates",
      title: "Certificates",
      description: "View and download your earned certificates.",
      icon: "document-text-outline" as const,
      color: theme.sectionHeadingColor,
      bgColor: "#fdeced",
    },
    {
      id: "internships",
      title: "Internships",
      description: "Explore opportunities to kickstart your career.",
      icon: "briefcase-outline" as const,
      color: theme.sectionHeadingColor,
      bgColor: "#fdeced",
    },
    {
      id: "workshops",
      title: "Workshops",
      description: "Enhance your skills with our interactive workshops.",
      icon: "color-palette-outline" as const,
      color: theme.sectionHeadingColor,
      bgColor: "#fdeced",
    },
    {
      id: "events",
      title: "Events",
      description: "Participate in upcoming events and seminars.",
      icon: "calendar-outline" as const,
      color: theme.sectionHeadingColor,
      bgColor: "#fdeced",
    },
  ];

  return (
    <SafeAreaView
      style={[globalStyles.screen, { paddingHorizontal: 0, margin: 0 }]}
    >
      <Header>
        <Text
          style={{
            color: theme.red,
            fontSize: 30,
            paddingHorizontal: 15,
            fontFamily: theme.fontBold,
          }}
        >
          For Student
        </Text>
      </Header>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Welcome! Here's what we have for you.
        </Text>
        
        {options.map((option) => (
          <Pressable key={option.id} style={({ pressed }) => [
            styles.card,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
          ]}>
            <View style={[styles.iconContainer, { backgroundColor: option.bgColor }]}>
              <Ionicons name={option.icon} size={32} color={option.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.text} style={styles.arrowIcon} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },
  subtitle: {
    fontFamily: theme.font,
    fontSize: 16,
    color: theme.text,
    marginBottom: 20,
    marginTop: 5,
    paddingHorizontal: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.backgroundColorLight,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.fontBold,
    fontSize: 18,
    color: theme.sectionHeadingColor,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: theme.font,
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
  arrowIcon: {
    marginLeft: 10,
    opacity: 0.5,
  },
});
