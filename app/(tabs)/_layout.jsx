import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import {
    spacing,
    fontSize,
    iconSize,
    deviceInfo,
} from '../../utils/responsive';

const renderTabBarIcon = (routeName, focused, color) => {
    let iconName;
    const size = deviceInfo.isTablet ? iconSize.xl : iconSize.lg;

    switch (routeName) {
        case 'home':
            iconName = focused ? 'home' : 'home-outline';
            break;
        case 'favorite':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
        case 'inbox':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
        case 'profile':
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            break;
        case 'match':
            iconName = focused ? 'compass' : 'compass-outline';
            break;
        case 'admin':
            iconName = focused ? 'settings' : 'settings-outline';
            break;
        default:
            iconName = 'alert-circle-outline';
            break;
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

export default function TabLayout() {
    const { userRole } = useFirebaseAuth();
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#667eea',
                tabBarInactiveTintColor: '#999',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontFamily: 'PermanentMarker-Regular',
                    fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
                    marginBottom: Platform.OS === 'android' ? 0 : spacing.xs,
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopColor: '#e1e5e9',
                    borderTopWidth: 1,
                    height: deviceInfo.isTablet
                        ? (Platform.OS === 'android' ? 110 : 90)
                        : (Platform.OS === 'android' ? 90 : 70),
                    paddingBottom: deviceInfo.isTablet
                        ? (Platform.OS === 'android' ? spacing.xl : spacing.lg)
                        : (Platform.OS === 'android' ? spacing.xl : spacing.md),
                    paddingTop: spacing.md,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                },
                tabBarIconStyle: {
                    marginTop: Platform.OS === 'ios' ? 0 : -spacing.xs,
                },
                tabBarIcon: ({ focused, color }) => renderTabBarIcon(route.name, focused, color),
            })}
        >
            <Tabs.Screen name="home" options={{ title: 'Home' }} />
            <Tabs.Screen name="favorite" options={{ title: 'Favorites' }} />
            <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
            <Tabs.Screen name="match" options={{ title: 'Match' }} />
            {userRole === 'admin' && (
                <Tabs.Screen name="admin" options={{ title: 'Admin' }} />
            )}
        </Tabs>
    )
}