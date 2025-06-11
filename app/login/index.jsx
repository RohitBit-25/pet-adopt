import {
    View,
    Text,
    Image,
    Pressable,
    Alert,
    StyleSheet,
    StatusBar,
    ScrollView,
    Animated,
    TouchableOpacity
} from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useAuth, useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    verticalScale
} from '../../utils/responsive';

// Preload the browser for a better UX
export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

// Ensure any pending auth sessions are completed
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();
    const { startSSOFlow } = useSSO();
    const { isSignedIn, signOut } = useAuth();
    const { setActive } = useClerk();
    const [isLoading, setIsLoading] = useState(false);

    // Animation refs
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    // Initialize animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onPress = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true });
            console.log("Generated Redirect URL:", redirectUrl);

            if (isSignedIn) {
                console.log("Signing out existing session...");
                await signOut();
            }

            const response = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl,
            });

            if (!response) {
                throw new Error("Empty response from Clerk");
            }

            const { createdSessionId, signIn, signUp } = response;

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                console.log("Session Activated:", createdSessionId);
                Linking.openURL(Linking.createURL('/(tabs)/home'));
            } else {
                console.warn("Session ID missing! Handling next steps...");

                if (signIn) {
                    console.log("Handling sign-in flow...");
                    await signIn.continue();
                }
                if (signUp) {
                    console.log("Handling sign-up flow...");
                    await signUp.continue();
                }
            }
        } catch (err) {
            console.error("Auth Error:", err.message || JSON.stringify(err, null, 2));
            Alert.alert("Authentication Failed", err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [isSignedIn, signOut, startSSOFlow, setActive, isLoading]);

    // Parallax effect for hero image
    const heroTranslateY = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [0, -150],
        extrapolate: 'clamp',
    });

    const heroScale = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [1, 1.2],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                bounces={true}
                bouncesZoom={true}
            >
                {/* Background Gradient */}
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.backgroundGradient}
                >
                    {/* Hero Image with Parallax */}
                    <Animated.View
                        style={[
                            styles.imageContainer,
                            {
                                transform: [
                                    { translateY: heroTranslateY },
                                    { scale: heroScale }
                                ]
                            }
                        ]}
                    >
                        <Image
                            source={require('./../../assets/images/login2.jpg')}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                        <Animated.View
                            style={[
                                styles.imageOverlay,
                                { opacity: headerOpacity }
                            ]}
                        />
                    </Animated.View>

                    {/* Animated Content */}
                    <Animated.View
                        style={[
                            styles.contentContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ]
                            }
                        ]}
                    >
                        {/* Logo with bounce animation */}
                        <Animated.View style={styles.logoContainer}>
                            <Animated.View
                                style={[
                                    styles.logoIcon,
                                    {
                                        transform: [{ scale: scaleAnim }]
                                    }
                                ]}
                            >
                                <MaterialIcons name="pets" size={deviceInfo.isTablet ? 80 : 60} color="white" />
                            </Animated.View>
                            <Animated.Text
                                style={[
                                    styles.appName,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                    }
                                ]}
                            >
                                PetAdopt
                            </Animated.Text>
                        </Animated.View>

                        {/* Welcome text with staggered animation */}
                        <Animated.Text
                            style={[
                                styles.welcomeTitle,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            Ready to make a new Friend?
                        </Animated.Text>

                        <Animated.Text
                            style={[
                                styles.welcomeSubtitle,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            Let's adopt the pet you love and make a new family member.
                        </Animated.Text>

                        {/* Animated Features */}
                        <Animated.View
                            style={[
                                styles.featuresContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            {[
                                { icon: 'search', text: 'Find Perfect Pets', color: '#4ecdc4' },
                                { icon: 'chat', text: 'Chat with Owners', color: '#ff6b6b' },
                                { icon: 'favorite', text: 'Save Favorites', color: '#f5d372' }
                            ].map((feature, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.featureItem}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        // Add haptic feedback or animation
                                        console.log(`Feature ${feature.text} pressed`);
                                    }}
                                >
                                    <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                                        <MaterialIcons
                                            name={feature.icon}
                                            size={deviceInfo.isTablet ? 28 : 24}
                                            color="white"
                                        />
                                    </View>
                                    <View style={styles.featureTextContainer}>
                                        <Text style={styles.featureText}>{feature.text}</Text>
                                        <Text style={styles.featureSubtext}>
                                            {index === 0 && "Browse thousands of pets"}
                                            {index === 1 && "Connect directly with owners"}
                                            {index === 2 && "Keep track of your favorites"}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>
                            ))}
                        </Animated.View>

                        {/* Animated Login Button */}
                        <Animated.View
                            style={[
                                styles.loginButtonContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <Pressable
                                onPress={onPress}
                                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                disabled={isLoading}
                                android_ripple={{ color: 'rgba(102, 126, 234, 0.2)' }}
                            >
                                <LinearGradient
                                    colors={isLoading ? ['#f0f0f0', '#e0e0e0'] : ['white', '#f8f9fa']}
                                    style={styles.loginButtonGradient}
                                >
                                    <View style={styles.loginButtonContent}>
                                        {isLoading ? (
                                            <>
                                                <Animated.View
                                                    style={{
                                                        transform: [{
                                                            rotate: scrollY.interpolate({
                                                                inputRange: [0, 360],
                                                                outputRange: ['0deg', '360deg'],
                                                            })
                                                        }]
                                                    }}
                                                >
                                                    <MaterialIcons name="hourglass-empty" size={24} color="#667eea" />
                                                </Animated.View>
                                                <Text style={styles.loginButtonText}>Signing In...</Text>
                                            </>
                                        ) : (
                                            <>
                                                <MaterialIcons name="login" size={24} color="#667eea" />
                                                <Text style={styles.loginButtonText}>Continue with Google</Text>
                                            </>
                                        )}
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        </Animated.View>

                        {/* Terms text */}
                        <Animated.Text
                            style={[
                                styles.termsText,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </Animated.Text>

                        {/* Additional scroll content for better UX */}
                        <View style={styles.additionalContent}>
                            <Text style={styles.scrollHintText}>Scroll to explore features</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={24} color="rgba(255,255,255,0.6)" />
                        </View>
                    </Animated.View>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    backgroundGradient: {
        minHeight: SCREEN_HEIGHT * 1.2, // Allow for scroll
        paddingBottom: spacing.xxl,
    },
    imageContainer: {
        height: deviceInfo.isTablet ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.45,
        position: 'relative',
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '120%', // Larger for parallax effect
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(102, 126, 234, 0.3)',
    },
    contentContainer: {
        paddingHorizontal: responsivePadding.horizontal,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxl * 2,
        minHeight: SCREEN_HEIGHT * 0.8,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
        marginTop: spacing.lg,
    },
    logoIcon: {
        marginBottom: spacing.md,
        padding: spacing.lg,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    appName: {
        fontSize: deviceInfo.isTablet ? fontSize.hero + 8 : fontSize.hero,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
        textAlign: 'center',
    },
    welcomeTitle: {
        fontSize: deviceInfo.isTablet ? fontSize.hero : fontSize.heading,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Pacifico-Regular',
        marginBottom: spacing.lg,
        lineHeight: deviceInfo.isTablet ? 44 : 36,
        paddingHorizontal: spacing.md,
    },
    welcomeSubtitle: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: spacing.xxl,
        lineHeight: deviceInfo.isTablet ? 28 : 24,
        paddingHorizontal: spacing.lg,
    },
    featuresContainer: {
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        padding: spacing.lg,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: borderRadius.lg,
        ...shadow.small,
    },
    featureIconContainer: {
        width: deviceInfo.isTablet ? 50 : 44,
        height: deviceInfo.isTablet ? 50 : 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureText: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: spacing.xs / 2,
    },
    featureSubtext: {
        fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Pacifico-Regular',
    },
    loginButtonContainer: {
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    loginButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadow.large,
    },
    loginButtonGradient: {
        paddingVertical: deviceInfo.isTablet ? spacing.xl : spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        fontWeight: 'bold',
        color: '#667eea',
        marginLeft: spacing.md,
        fontFamily: 'PermanentMarker-Regular',
    },
    termsText: {
        fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        fontFamily: 'Pacifico-Regular',
        marginBottom: spacing.xl,
        lineHeight: deviceInfo.isTablet ? 22 : 18,
        paddingHorizontal: spacing.lg,
    },
    additionalContent: {
        alignItems: 'center',
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xl,
    },
    scrollHintText: {
        fontSize: deviceInfo.isTablet ? fontSize.lg : fontSize.md,
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'Pacifico-Regular',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
});
