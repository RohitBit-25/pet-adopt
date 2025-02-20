import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'Yellow',
                tabBarInactiveTintColor: 'Green',
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopColor: 'transparent',
                    elevation: 0
                }
            }}
        >
            <Tabs.Screen name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color="Blue" />

                }}
            />
            <Tabs.Screen name="favorite"
                options={{
                    title: 'Favorite',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="heart" size={28} color="Blue" />
                }}
            />
            <Tabs.Screen name="inbox"
                options={{
                    title: 'Inbox',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={28} color="Blue" />
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="people-circle" size={28} color="Blue" />
                }}
            />
        </Tabs>
    )
}