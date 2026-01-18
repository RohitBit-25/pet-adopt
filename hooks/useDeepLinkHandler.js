import { useEffect } from "react";
import * as Linking from "expo-linking";

export const useDeepLinkHandler = () => {
  useEffect(() => {
    const handleDeepLink = (url) => {
      console.log("🔗 Deep link received:", url);
      // Handle OAuth redirect
      if (url.includes("oauth-redirect") || url.includes("petadopt://")) {
        console.log("✅ OAuth redirect detected, handling...");
        // The OAuth flow will handle this automatically
      }
    };
    // Handle initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("🔗 Initial URL:", url);
        handleDeepLink(url);
      }
    });
    // Listen for incoming deep links
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });
    return () => {
      subscription?.remove();
    };
  }, []);
};
