import { styleFactory } from "@/src/styleFactory";
import { theme } from "@/src/theme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WriteToUs() {
  const globalStyle = styleFactory();
  const [name, setName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [equiry, setEnquiry] = useState<string>("");
  return (
    <SafeAreaView style={globalStyle.screen}>
      <ScrollView>
        <Text
          style={{
            backgroundColor: theme.sectionHeadingColor,
            padding: 20,
            fontSize: 30,
            color: "white",
            fontFamily: theme.fontBold,
          }}
        >
          Write To Us
        </Text>
        <View style={[globalStyle.container]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={[globalStyle.text, { fontSize: 20 }]}>Name</Text>
            <TextInput
              style={[globalStyle.inputField]}
              placeholder="Enter Your Name"
              value={name}
              onChangeText={setName}
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={[globalStyle.text, { fontSize: 20 }]}>
              Designation
            </Text>
            <TextInput
              style={[globalStyle.inputField]}
              placeholder="Enter Your Designation"
              value={designation}
              onChangeText={setDesignation}
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={[globalStyle.text, { fontSize: 20 }]}>Email ID</Text>
            <TextInput
              style={[globalStyle.inputField]}
              placeholder="Enter Your Email ID"
              value={email}
              onChangeText={setEmail}
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={[globalStyle.text, { fontSize: 20 }]}>
              Contact Number
            </Text>
            <TextInput
              style={[globalStyle.inputField]}
              placeholder="Enter Your Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={[globalStyle.text, { fontSize: 20 }]}>Enquiry</Text>
            <TextInput
              style={[
                globalStyle.inputField,
                { minHeight: 100, textAlignVertical: "top" },
              ]}
              placeholder="Enter Your Enquiry"
              value={equiry}
              multiline={true}
              onChangeText={setEnquiry}
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
