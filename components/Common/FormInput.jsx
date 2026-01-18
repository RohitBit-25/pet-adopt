import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { spacing, fontSize, borderRadius } from '../../utils/responsive';
import { MaterialIcons } from '@expo/vector-icons';

export default function FormInput({ control, name, rules = {}, placeholder, secureTextEntry, label, icon, ...props }) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View style={styles.container}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    <View style={[styles.inputContainer, error && styles.errorBorder]}>
                        {icon && <MaterialIcons name={icon} size={20} color={error ? '#ff6b6b' : '#666'} style={styles.icon} />}
                        <TextInput
                            style={styles.input}
                            placeholder={placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={secureTextEntry}
                            {...props}
                        />
                    </View>
                    {error && <Text style={styles.errorText}>{error.message || 'Error'}</Text>}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: fontSize.md,
        color: '#333',
        marginBottom: spacing.sm,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: '#e1e5e9',
        paddingHorizontal: spacing.md,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: fontSize.md,
    },
    errorBorder: {
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: fontSize.sm,
        marginTop: spacing.xs,
        marginLeft: spacing.sm,
    },
}); 