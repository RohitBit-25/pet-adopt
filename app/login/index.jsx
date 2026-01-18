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
