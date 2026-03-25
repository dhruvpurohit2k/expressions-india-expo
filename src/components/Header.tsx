import { View, StyleSheet } from "react-native";
import { theme } from "../theme";
export default function Header({ children }: { children?: React.ReactNode }) {
  const style = StyleSheet.create({
    header: {
      height: 64,
      backgroundColor: theme.sectionHeadingColor,
      justifyContent: "center",
    },
  });
  return <View style={style.header}>{children}</View>;
}
