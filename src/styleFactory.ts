import { StyleSheet } from "react-native";
import { theme } from "./theme";
import { Dimensions } from "react-native";

export const styleFactory = () => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.backgroundColorLight,
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
      // backgroundColor: theme.backgroundColor,
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      marginHorizontal: 12,
      // elevation: 2,
      // borderWidth: 1,
      // borderColor: theme.backgroundColorLight,
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
      backgroundColor: theme.backgroundColorLight,
      margin: 15,
      borderRadius: 10,
      elevation: 3,
      // borderWidth: 1,
      // borderColor: theme.backgroundColorLight,
    },
    companyName: {
      fontFamily: "Delius_400Regular",
      color: theme.sectionHeadingColor,
    },
    stackButton: {
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 5,
      paddingVertical: 20,
      justifyContent: "center",
      flex: 1,
    },
    stackButtonText: {
      textAlign: "center",
      color: theme.text,
      fontFamily: theme.fontBold,
    },
    swipeDotIndicatorContainer: {
      width: Dimensions.get("window").width,
      justifyContent: "center",
      marginVertical: 10,
      flexDirection: "row",
      gap: 10,
    },
    swipeDotActive: {
      width: 10,
      height: 10,
      backgroundColor: theme.sectionHeadingColor,
      borderRadius: 20,
    },
    swipeDotInActive: {
      width: 7,
      height: 7,
      borderRadius: 20,
    },
  });
};
