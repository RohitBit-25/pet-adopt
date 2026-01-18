import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EmailVerification = ({ user, isEmailVerified, onSendVerification }) => {
    if (!user || isEmailVerified) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                Please verify your email to continue.
            </Text>
            <TouchableOpacity onPress={onSendVerification} style={styles.resendButton}>
                <Text style={styles.resendText}>Resend Verification Email</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    message: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginBottom: 8,
    },
    resendButton: {
        alignSelf: 'center',
        marginBottom: 8,
    },
    resendText: {
        color: '#fff',
        textDecorationLine: 'underline',
    },
});

export default EmailVerification; 