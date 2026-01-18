import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

const PasswordReset = ({ visible, onReset, resetMessage }) => {
    const [resetEmail, setResetEmail] = useState('');

    const handleReset = () => {
        onReset(resetEmail);
    };

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <AuthInput
                placeholder="Enter your email"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
            />
            <AuthButton
                title="Send Reset Link"
                onPress={handleReset}
            />
            {resetMessage && (
                <Text style={styles.message}>{resetMessage}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
    },
    message: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default PasswordReset; 