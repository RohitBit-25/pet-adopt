import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen({ message = "Loading..." }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Scale animation
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Rotation animation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.container}
        >
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* App Logo */}
                <View style={styles.logoContainer}>
                    <Animated.View 
                        style={[
                            styles.iconContainer,
                            { transform: [{ rotate: spin }] }
                        ]}
                    >
                        <MaterialIcons name="pets" size={80} color="white" />
                    </Animated.View>
                    <Text style={styles.appName}>PetAdopt</Text>
                    <Text style={styles.tagline}>Find Your Perfect Companion</Text>
                </View>

                {/* Loading Indicator */}
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingDots}>
                        <Animated.View style={[styles.dot, styles.dot1]} />
                        <Animated.View style={[styles.dot, styles.dot2]} />
                        <Animated.View style={[styles.dot, styles.dot3]} />
                    </View>
                    <Text style={styles.loadingText}>{message}</Text>
                </View>

                {/* Features Preview */}
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <MaterialIcons name="search" size={24} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.featureText}>Discover Pets</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <MaterialIcons name="chat" size={24} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.featureText}>Connect Owners</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <MaterialIcons name="favorite" size={24} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.featureText}>Find Love</Text>
                    </View>
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Pacifico-Regular',
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    loadingDots: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'white',
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.7,
    },
    dot3: {
        opacity: 1,
    },
    loadingText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'PermanentMarker-Regular',
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    featureItem: {
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'PermanentMarker-Regular',
        textAlign: 'center',
    },
});
