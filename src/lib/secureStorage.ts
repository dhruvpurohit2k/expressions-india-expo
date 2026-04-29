import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

if (Platform.OS === "web") {
  throw new Error(
    "secureStorage: web is not a supported platform — tokens must not be stored in localStorage",
  );
}

export async function setItem(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function deleteItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
