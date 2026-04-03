import { styleFactory } from "@/src/styleFactory";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/ui/button";
import Header from "@/src/components/Header";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact Number must be at least 10 digits"),
  enquiry: z.string().min(5, "Enquiry must be at least 5 characters"),
});

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

export default function WriteToUs() {
  const globalStyle = styleFactory();

  const form = useForm({
    defaultValues: {
      name: "",
      designation: "",
      email: "",
      contactNumber: "",
      enquiry: "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("designation", value.designation);
      formData.append("email", value.email);
      formData.append("contactNumber", value.contactNumber);
      formData.append("enquiry", value.enquiry);
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/enquery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        if (response.ok) {
          Alert.alert("Success", "Your query has been submitted successfully.");
          form.reset();
        } else {
          Alert.alert(
            "Error",
            "Failed to submit your query. Please try again later.",
          );
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <SafeAreaView style={globalStyle.screen}>
      <ScrollView>
        <Header>
          <Text
            style={{
              fontSize: 30,
              paddingHorizontal: 10,
              color: theme.red,
              fontFamily: theme.fontBold,
            }}
          >
            Write To Us
          </Text>
        </Header>
        <View
          style={[
            globalStyle.container,
            {
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              elevation: 1,
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <form.Field
              name="name"
              validators={{ onChange: ContactFormSchema.shape.name }}
            >
              {(field) => (
                <View>
                  <Text style={[globalStyle.text, { fontSize: 20 }]}>Name</Text>
                  <TextInput
                    style={[globalStyle.inputField]}
                    placeholder="Enter Your Name"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text style={{ color: "red", marginTop: 6 }}>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <form.Field
              name="designation"
              validators={{ onChange: ContactFormSchema.shape.designation }}
            >
              {(field) => (
                <View>
                  <Text style={[globalStyle.text, { fontSize: 20 }]}>
                    Designation
                  </Text>
                  <TextInput
                    style={[globalStyle.inputField]}
                    placeholder="Enter Your Designation"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text style={{ color: "red", marginTop: 6 }}>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <form.Field
              name="email"
              validators={{ onChange: ContactFormSchema.shape.email }}
            >
              {(field) => (
                <View>
                  <Text style={[globalStyle.text, { fontSize: 20 }]}>
                    Email ID
                  </Text>
                  <TextInput
                    style={[globalStyle.inputField]}
                    placeholder="Enter Your Email ID"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text style={{ color: "red", marginTop: 6 }}>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <form.Field
              name="contactNumber"
              validators={{ onChange: ContactFormSchema.shape.contactNumber }}
            >
              {(field) => (
                <View>
                  <Text style={[globalStyle.text, { fontSize: 20 }]}>
                    Contact Number
                  </Text>
                  <TextInput
                    style={[globalStyle.inputField]}
                    placeholder="Enter Your Contact Number"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    keyboardType="phone-pad"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text style={{ color: "red", marginTop: 6 }}>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <form.Field
              name="enquiry"
              validators={{ onChange: ContactFormSchema.shape.enquiry }}
            >
              {(field) => (
                <View>
                  <Text style={[globalStyle.text, { fontSize: 20 }]}>
                    Enquiry
                  </Text>
                  <TextInput
                    style={[
                      globalStyle.inputField,
                      { minHeight: 100, textAlignVertical: "top" },
                    ]}
                    placeholder="Enter Your Enquiry"
                    value={field.state.value}
                    multiline={true}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text style={{ color: "red", marginTop: 6 }}>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>
          </KeyboardAvoidingView>

          <Button
            style={{ marginVertical: 20, alignSelf: "center" }}
            onPress={() => form.handleSubmit()}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
