import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { FirebaseAuthProvider } from '../context/FirebaseAuthContext';
import { useNotificationSetup } from '../hooks/useNotificationSetup';
import { useDeepLinkHandler } from '../hooks/useDeepLinkHandler';
import { logEvent } from "../utils/analytics";
import { AuthProvider } from "../context/FirebaseAuthContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Root() {
  // Set up notifications and deep links
  useNotificationSetup();
  useDeepLinkHandler();

  useEffect(() => {
    logEvent('app_open');
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="add-new-pet/index" />
      <Stack.Screen name="pet-details" />
      <Stack.Screen name="chat/index" />
      <Stack.Screen name="my-pets/index" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'PlaywriteITModerna-Regular': require('./../assets/fonts/PlaywriteITModerna-Regular.ttf'),
    'PlaywriteITModerna-ExtraLight': require('./../assets/fonts/PlaywriteITModerna-ExtraLight.ttf'),
    'PlaywriteITModerna-Light': require('./../assets/fonts/PlaywriteITModerna-Light.ttf'),
    'PlaywriteITModerna-Thin': require('./../assets/fonts/PlaywriteITModerna-Thin.ttf'),
    'Pacifico-Regular': require('./../assets/fonts/Pacifico-Regular.ttf'),
    'PermanentMarker-Regular': require('./../assets/fonts/PermanentMarker-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded or an error occurred
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Render the layout
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FirebaseAuthProvider>
          <Root />
        </FirebaseAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
