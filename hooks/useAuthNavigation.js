import { useEffect, useRef } from "react";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";
import { router } from "expo-router";

export const useAuthNavigation = () => {
  const { user, loading } = useFirebaseAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Do not navigate until auth state is determined
    if (loading) {
      return;
    }

    // Prevent navigation from running multiple times
    if (hasNavigated.current) {
      return;
    }

    if (user) {
      hasNavigated.current = true;
      router.replace("/(tabs)/home");
    } else {
      hasNavigated.current = true;
      router.replace("/login");
    }
  }, [user, loading]);
};
