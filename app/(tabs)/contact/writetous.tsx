import { theme } from "@/src/theme";
import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
  Alert,
  TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Animated, { FadeInDown } from "react-native-reanimated";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Must be at least 10 digits"),
  enquiry: z.string().min(5, "Must be at least 5 characters"),
});

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    return (error as any).message;
  }
  return "Invalid value";
}

function FormField({
  label,
  error,
  children,
  delay,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(350).delay(delay)}>
      <Text
        style={{
          fontFamily: theme.fontBold,
          fontSize: 12,
          color: "hsl(0,0%,45%)",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      {children}
      {error && (
        <Text
          style={{
            fontFamily: theme.font,
            fontSize: 12,
            color: "hsl(4, 74.2%, 51.9%)",
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </Animated.View>
  );
}

function StyledInput({
  hasError,
  multiline,
  ...props
}: TextInputProps & { hasError?: boolean; multiline?: boolean }) {
  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.backgroundColorLight,
          borderWidth: 1.5,
          borderColor: hasError
            ? "hsl(4, 74.2%, 51.9%)"
            : theme.backgroundColorDark,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          fontFamily: theme.font,
          color: theme.text,
        },
        multiline && { minHeight: 110, textAlignVertical: "top" },
      ]}
      placeholderTextColor="hsl(0,0%,70%)"
      multiline={multiline}
      {...props}
    />
  );
}

export default function WriteToUs() {
  const form = useForm({
    defaultValues: {
      name: "",
      designation: "",
      email: "",
      contactNumber: "",
      enquiry: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/enquiry`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: value.name,
              subject: value.designation,
              email: value.email,
              phone: value.contactNumber,
              message: value.enquiry,
            }),
          },
        );
        if (response.ok) {
          Alert.alert("Sent!", "Your message has been submitted successfully.");
          form.reset();
        } else {
          Alert.alert("Error", "Failed to submit. Please try again later.");
        }
      } catch {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          <Animated.Text
            entering={FadeInDown.duration(400)}
            style={{
              fontSize: 30,
              textAlign: "center",
              color: "rgb(225,0,0)",
              marginBottom: 6,
              marginTop: 6,
            }}
          >
            Write To Us
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(400).delay(50)}
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              color: "hsl(0,0%,55%)",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            {`We'd love to hear from you. Fill in the form and we'll get back to
            you shortly.`}
          </Animated.Text>

          <View style={{ gap: 18 }}>
            <form.Field
              name="name"
              validators={{ onChange: ContactFormSchema.shape.name }}
            >
              {(field) => (
                <FormField
                  label="Full Name"
                  error={
                    field.state.meta.errors.length > 0
                      ? getErrorMessage(field.state.meta.errors[0])
                      : undefined
                  }
                  delay={80}
                >
                  <StyledInput
                    placeholder="Your full name"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="designation"
              validators={{ onChange: ContactFormSchema.shape.designation }}
            >
              {(field) => (
                <FormField
                  label="Designation"
                  error={
                    field.state.meta.errors.length > 0
                      ? getErrorMessage(field.state.meta.errors[0])
                      : undefined
                  }
                  delay={120}
                >
                  <StyledInput
                    placeholder="Your designation or role"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onChange: ContactFormSchema.shape.email }}
            >
              {(field) => (
                <FormField
                  label="Email Address"
                  error={
                    field.state.meta.errors.length > 0
                      ? getErrorMessage(field.state.meta.errors[0])
                      : undefined
                  }
                  delay={160}
                >
                  <StyledInput
                    placeholder="you@example.com"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="contactNumber"
              validators={{ onChange: ContactFormSchema.shape.contactNumber }}
            >
              {(field) => (
                <FormField
                  label="Contact Number"
                  error={
                    field.state.meta.errors.length > 0
                      ? getErrorMessage(field.state.meta.errors[0])
                      : undefined
                  }
                  delay={200}
                >
                  <StyledInput
                    placeholder="+91 00000 00000"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    keyboardType="phone-pad"
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="enquiry"
              validators={{ onChange: ContactFormSchema.shape.enquiry }}
            >
              {(field) => (
                <FormField
                  label="Message"
                  error={
                    field.state.meta.errors.length > 0
                      ? getErrorMessage(field.state.meta.errors[0])
                      : undefined
                  }
                  delay={240}
                >
                  <StyledInput
                    placeholder="Write your message here…"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    multiline
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <Animated.View entering={FadeInDown.duration(350).delay(280)}>
              <Button
                style={{ alignSelf: "stretch", borderRadius: 14, marginTop: 4 }}
                onPress={() => form.handleSubmit()}
              >
                Send Message
              </Button>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
