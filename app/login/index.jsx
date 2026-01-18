<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { useAuthForm } from '../../hooks/useAuthForm';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import EmailVerification from '../../components/Auth/EmailVerification';
import PasswordReset from '../../components/Auth/PasswordReset';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function LoginScreen() {
    const { user, isEmailVerified } = useFirebaseAuth();
    const {
        isRegister,
        showReset,
        resetMessage,
        registerSuccess,
        loading,
        error,
        handleLogin,
        handleRegister,
        handleResetPassword,
        toggleMode,
        toggleReset,
        sendVerification,
    } = useAuthForm();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        if (user && isEmailVerified) {
            router.replace('/(tabs)/home');
        }
    }, [user, isEmailVerified]);

    const handleSubmit = () => {
        if (isRegister) {
            handleRegister(email, password, displayName);
        } else {
            handleLogin(email, password);
        }
    };

    return (
        <ErrorBoundary>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
                <StatusBar barStyle="light-content" />
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
                        <Text style={styles.title}>PetAdopt</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {registerSuccess && (
                            <Text style={styles.successText}>
                                Registration successful! Please check your email to verify your account.
                            </Text>
                        )}

                        <EmailVerification
                            user={user}
                            isEmailVerified={isEmailVerified}
                            onSendVerification={sendVerification}
                        />

                        {isRegister && (
                            <AuthInput
                                placeholder="Display Name"
                                value={displayName}
                                onChangeText={setDisplayName}
                                autoCapitalize="words"
                                testID="displayNameInput"
                            />
                        )}

                        <AuthInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            testID="emailInput"
                        />

                        <AuthInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            testID="passwordInput"
                        />

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <AuthButton
                            title={isRegister ? 'Register' : 'Login'}
                            onPress={handleSubmit}
                            loading={loading}
                            testID={isRegister ? 'registerButton' : 'loginButton'}
                        />

                        <TouchableOpacity onPress={toggleMode}>
                            <Text style={styles.switchText}>
                                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleReset}>
                            <Text style={[styles.switchText, { color: '#ffd700' }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <PasswordReset
                            visible={showReset}
                            onReset={handleResetPassword}
                            resetMessage={resetMessage}
                        />
                    </View>
                </ScrollView>
            </LinearGradient>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'PermanentMarker-Regular',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 24,
    },
    successText: {
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    switchText: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 15,
        marginBottom: 12,
        textAlign: 'center',
    },
});
=======
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
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
