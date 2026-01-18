import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const AuthInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    autoCapitalize = 'none',
    keyboardType = 'default',
    testID,
    ...props
}) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            testID={testID}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
    },
});

export default AuthInput; 