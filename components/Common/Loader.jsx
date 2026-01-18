import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

const Loader = ({ text = 'Loading...' }) => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        marginTop: 16,
        color: colors.textSecondary,
        fontSize: typography.fontSize.body,
        fontFamily: typography.fontFamily.regular,
    },
});

export default Loader; 