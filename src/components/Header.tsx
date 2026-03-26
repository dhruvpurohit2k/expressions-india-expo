import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../theme";
export default function Header({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
}) {
  const styles = StyleSheet.create({
    header: {
      height: 64,
      justifyContent: "center",
    },
  });
  return <View style={[styles.header, style]}>{children}</View>;
}
