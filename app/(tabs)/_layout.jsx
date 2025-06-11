import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    components
} from '../../utils/responsive';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#667eea',
                tabBarInactiveTintColor: '#999',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontFamily: 'PermanentMarker-Regular',
                    fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
                    marginBottom: Platform.OS === 'ios' ? 0 : spacing.xs,
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopColor: '#e1e5e9',
                    borderTopWidth: 1,
                    height: deviceInfo.isTablet
                        ? (Platform.OS === 'ios' ? 110 : 90)
                        : (Platform.OS === 'ios' ? 90 : 70),
                    paddingBottom: deviceInfo.isTablet
                        ? (Platform.OS === 'ios' ? spacing.xl : spacing.lg)
                        : (Platform.OS === 'ios' ? spacing.xl : spacing.md),
                    paddingTop: spacing.md,
                    ...shadow.large,
                    shadowOffset: { width: 0, height: -2 },
                },
                tabBarIconStyle: {
                    marginTop: Platform.OS === 'ios' ? 0 : -spacing.xs,
                }
            }}
        >
            <Tabs.Screen name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={deviceInfo.isTablet ? iconSize.xl : iconSize.lg}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen name="favorite"
                options={{
                    title: 'Favorites',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "heart" : "heart-outline"}
                            size={deviceInfo.isTablet ? iconSize.xl : iconSize.lg}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen name="inbox"
                options={{
                    title: 'Inbox',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "chatbubbles" : "chatbubbles-outline"}
                            size={deviceInfo.isTablet ? iconSize.xl : iconSize.lg}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"}
                            size={deviceInfo.isTablet ? iconSize.xl : iconSize.lg}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs>
    )
}