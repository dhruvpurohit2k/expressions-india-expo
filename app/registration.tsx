import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { useForm } from "@tanstack/react-form";
import { styleFactory } from "@/src/styleFactory";
import { z } from "zod";
import React from "react";
import { theme } from "@/src/theme";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  institution: z.string().min(1, "Institution is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.email("Invalid email address"),
});

export default function Registration() {
  const globalStyles = styleFactory();

  const form = useForm({
    defaultValues: {
      name: "",
      institution: "",
      mobile: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Registration form submitted:", value);
    },
  });

  return (
    <SafeAreaView style={globalStyles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={globalStyles.sectionHeading}>Registration</Text>

        <View style={[globalStyles.container, { gap: 14 }]}>
          <form.Field
            name="name"
            validators={{ onChange: FormSchema.shape.name }}
          >
            {(field) => (
              <View>
                <Text style={globalStyles.text}>Name</Text>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter your name"
                  style={globalStyles.inputField}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={{ color: "red", marginTop: 6 }}>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          <form.Field
            name="institution"
            validators={{ onChange: FormSchema.shape.institution }}
          >
            {(field) => (
              <View>
                <Text style={globalStyles.text}>Institution</Text>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter your institution"
                  style={globalStyles.inputField}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={{ color: "red", marginTop: 6 }}>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          <form.Field
            name="mobile"
            validators={{ onChange: FormSchema.shape.mobile }}
          >
            {(field) => (
              <View>
                <Text style={globalStyles.text}>Mobile</Text>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  style={globalStyles.inputField}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={{ color: "red", marginTop: 6 }}>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: FormSchema.shape.email }}
          >
            {(field) => (
              <View>
                <Text style={globalStyles.text}>Email</Text>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={globalStyles.inputField}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={{ color: "red", marginTop: 6 }}>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          <Pressable
            onPress={() => form.handleSubmit()}
            style={{
              backgroundColor: theme.sectionHeadingColor,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: theme.fontBold,
                fontSize: 16,
              }}
            >
              Submit
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Invalid value";
}
