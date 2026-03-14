import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const styleFactory = () => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      //   paddingVertical: 20,
    },
    title: {
      fontFamily: theme.fontBold,
      fontSize: 44,
      color: theme.text,
      marginVertical: 15,
    },
    sectionHeading: {
      fontSize: theme.sectionHeadingSize,
      fontFamily: theme.fontBold,
      marginVertical: 10,
      color: theme.sectionHeadingColor,
    },

    container: {
      backgroundColor: theme.backgroundColor,
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.backgroundColorLight,
    },
    text: {
      fontSize: theme.fontSize,
      color: theme.text,
      fontFamily: theme.font,
      marginVertical: 10,
      textAlign: "justify",
    },
    aboutCard: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: theme.backgroundColor,
      margin: 15,
      borderRadius: 20,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.backgroundColorLight,
    },
    companyName: {
      fontFamily: "Delius_400Regular",
      color: theme.sectionHeadingColor,
    },
  });
};
