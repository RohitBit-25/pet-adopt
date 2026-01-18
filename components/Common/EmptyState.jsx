import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

const EmptyState = ({
    title = 'Nothing here yet',
    subtitle = 'Check back later or add something new!',
    icon = 'pets',
    animation = require('../../assets/lottie/empty.json')
}) => (
    <View style={styles.container}>
        {animation ? (
            <LottieView
                source={animation}
                autoPlay
                loop
                style={styles.lottie}
            />
        ) : (
            <View style={styles.iconContainer}>
                <MaterialIcons name={icon} size={80} color={colors.textSecondary} />
            </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: 32,
    },
    lottie: {
        width: 180,
        height: 180,
        marginBottom: 24,
    },
    iconContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: typography.fontSize.h2,
        color: colors.text,
        fontFamily: typography.fontFamily.heading,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.regular,
        textAlign: 'center',
        marginBottom: 12,
    },
});

export default EmptyState; 