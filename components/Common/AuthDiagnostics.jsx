import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AuthDiagnostics({ onClose }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auth Diagnostics</Text>
            <Text style={styles.info}>Firebase diagnostics are not implemented yet.</Text>
            <TouchableOpacity onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    info: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
    button: { backgroundColor: '#667eea', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});
