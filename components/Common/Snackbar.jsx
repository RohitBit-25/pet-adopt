import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

const { width } = Dimensions.get('window');

const Snackbar = ({ visible, message, type = 'info', duration = 2500, onHide }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
            const timer = setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide && onHide());
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onHide, slideAnim]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: colors[type] || colors.info, transform: [{ translateY: slideAnim }] },
            ]}
            accessibilityLiveRegion="polite"
            accessible
        >
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        left: width * 0.1,
        width: width * 0.8,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        zIndex: 1000,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    text: {
        color: colors.textLight,
        fontSize: typography.fontSize.body,
        fontFamily: typography.fontFamily.regular,
        textAlign: 'center',
    },
});

export default Snackbar; 