import React, { useRef } from 'react';
import { Pressable, Animated, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedButton = ({
    onPress,
    disabled = false,
    loading = false,
    title,
    icon,
    endIcon,
    colors = ['#ff6b6b', '#667eea'],
    style,
    textStyle,
    children
}) => {
    const buttonScale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
            disabled={disabled || loading}
        >
            <Animated.View style={{
                transform: [{ scale: buttonScale }],
                shadowColor: colors[0],
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.18,
                shadowRadius: 12,
                elevation: 8,
                backgroundColor: 'transparent',
                opacity: (disabled || loading) ? 0.7 : 1,
                ...style,
            }}>
                <LinearGradient
                    colors={(disabled || loading) ? ['#ccc', '#999'] : colors}
                    style={{ borderRadius: 25, padding: 2 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 56,
                    }}>
                        {children || (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                {loading ? (
                                    <>
                                        <MaterialIcons name="hourglass-empty" size={24} color="white" />
                                        <Text style={[{ color: 'white', fontWeight: 'bold', fontSize: 16 }, textStyle]}>
                                            Processing...
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        {icon && <MaterialIcons name={icon} size={24} color="white" />}
                                        <Text style={[{ color: 'white', fontWeight: 'bold', fontSize: 16 }, textStyle]}>
                                            {title}
                                        </Text>
                                        {endIcon && <MaterialIcons name={endIcon} size={20} color="white" />}
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </Animated.View>
        </Pressable>
    );
};

export default AnimatedButton; 