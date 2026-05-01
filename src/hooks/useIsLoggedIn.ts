import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { isLoggedIn } from "@/src/lib/auth";

export function useIsLoggedIn(): boolean | null {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    isLoggedIn().then(setLoggedIn);
  }, [isFocused]);

  return loggedIn;
}
