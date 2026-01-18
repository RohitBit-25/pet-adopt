import { Stack } from 'expo-router';

export default function EventsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Events' }} />
            <Stack.Screen name="admin" options={{ title: 'Create Event' }} />
            <Stack.Screen name="my-events" options={{ title: 'My Events' }} />
        </Stack>
    );
} 