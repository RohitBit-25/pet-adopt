import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useAuth, useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

// Preload the browser for a better UX
export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

// Ensure any pending auth sessions are completed
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();
    const { startSSOFlow } = useSSO();
    const { isSignedIn, signOut } = useAuth();
    const { setActive } = useClerk();

    const onPress = useCallback(async () => {
        try {
            const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
            console.log("Generated Redirect URL:", redirectUrl);

            if (isSignedIn) {
                console.log("Signing out existing session...");
                await signOut();
            }

            const response = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl,  // ✅ Using AuthSession to generate redirect URI
            });

            if (!response) {
                throw new Error("Empty response from Clerk");
            }

            const { createdSessionId, signIn, signUp } = response;

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                console.log("Session Activated:", createdSessionId);

                // ✅ Redirect to Home using deep linking
                Linking.openURL(Linking.createURL('/(tabs)/home'));
            } else {
                console.warn("Session ID missing! Handling next steps...");

                if (signIn) {
                    console.log("Handling sign-in flow...");
                    await signIn.continue();
                }
                if (signUp) {
                    console.log("Handling sign-up flow...");
                    await signUp.continue();
                }
            }
        } catch (err) {
            console.error("Auth Error:", err.message || JSON.stringify(err, null, 2));
            Alert.alert("Authentication Failed", err.message || "Something went wrong. Please try again.");
        }
    }, [isSignedIn, signOut, startSSOFlow, setActive]);

    return (
        <View style={{ backgroundColor: 'white', height: '100%', display: 'flex' }}>
            <Image
                source={require('./../../assets/images/login2.jpg')}
                style={{ width: '120%', height: 500 }}
            />
            <View style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Pacifico', fontSize: 40, textAlign: 'center' }}>
                    Ready to make a new Friend?
                </Text>
                <Text style={{ fontFamily: 'PermanentMarker', fontSize: 18, textAlign: 'center', padding: 10, color: 'gray' }}>
                    Let's adopt the pet you love and make a new family member.
                </Text>

                <Pressable
                    onPress={onPress}
                    style={{
                        backgroundColor: 'blue',
                        padding: 10,
                        borderRadius: 20,
                        width: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20
                    }}>
                    <Text style={{ color: 'white', fontFamily: 'PermanentMarker', fontSize: 20 }}>
                        Get Started
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
