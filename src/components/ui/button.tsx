import {
  Pressable,
  View,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps,
  StyleProp,
} from "react-native";
import { theme } from "@/src/theme";
import { forwardRef } from "react";

interface ButtonProps extends Omit<PressableProps, "style"> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  styles?: {
    viewStyle?: ViewStyle;
    textStyle?: TextStyle;
  };
}

const Button = forwardRef<View, ButtonProps>(
  ({ children, styles, style, ...restProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          {
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: theme.red,
            alignSelf: "flex-start",
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          },
          styles?.viewStyle,
          style,
          pressed && {
            opacity: 0.8,
            transform: [{ scale: 0.95 }],
          },
        ]}
        {...restProps}
      >
        <Text
          style={[
            {
              fontFamily: theme.fontBold,
              fontSize: 15,
              letterSpacing: 0.5,
              color: "white",
            },
            styles?.textStyle,
          ]}
        >
          {children}
        </Text>
      </Pressable>
    );
  },
);

Button.displayName = "Button";

export default Button;
