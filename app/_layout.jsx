import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { useFonts } from 'expo-font';
import { tokenCache } from '@/cache'

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  useFonts({
    'PlaywriteITModerna': require('./../assets/fonts/PlaywriteITModerna-Regular.ttf'),
    'PlaywriteITModernaExtraLight': require('./../assets/fonts/PlaywriteITModerna-ExtraLight.ttf'),
    'PlaywriteITModernaLight': require('./../assets/fonts/PlaywriteITModerna-Light.ttf'),
    'PlaywriteITModernaThin': require('./../assets/fonts/PlaywriteITModerna-Thin.ttf'),
    'Pacifico': require('./../assets/fonts/Pacifico-Regular.ttf'),
    'PermanentMarker': require('./../assets/fonts/PermanentMarker-Regular.ttf'),
  })
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>

      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)"
          options={{
            headerShown: false
          }} />
        <Stack.Screen name="login/index"
          options={{
            headerShown: false
          }} />
      </Stack>
    </ClerkProvider>
  )
}
