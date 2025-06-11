import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

const { width } = Dimensions.get('window');

export default function UserItem({ userInfo }) {
    const handlePress = () => {
        router.push({
            pathname: '/chat',
            params: { id: userInfo?.docId }
        });
    };

    const getLastMessageTime = () => {
        if (userInfo?.lastMessageTime) {
            return moment(userInfo.lastMessageTime).fromNow();
        }
        return 'Recently';
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.userItemCard}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: userInfo?.imageUrl || 'https://via.placeholder.com/60' }}
                        style={styles.avatar}
                    />
                    <View style={styles.onlineIndicator} />
                </View>

                <View style={styles.userInfo}>
                    <View style={styles.userHeader}>
                        <Text style={styles.userName}>{userInfo?.name || 'Unknown User'}</Text>
                        <Text style={styles.timeText}>{getLastMessageTime()}</Text>
                    </View>

                    <View style={styles.messagePreview}>
                        <Text style={styles.lastMessage} numberOfLines={1}>
                            {userInfo?.lastMessage || 'Start a conversation about pet adoption'}
                        </Text>
                        {userInfo?.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>
                                    {userInfo.unreadCount > 9 ? '9+' : userInfo.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    userItemCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#667eea',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4ecdc4',
        borderWidth: 2,
        borderColor: 'white',
    },
    userInfo: {
        flex: 1,
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'PermanentMarker-Regular',
        flex: 1,
    },
    timeText: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Pacifico-Regular',
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        flex: 1,
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: '#ff6b6b',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    unreadText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
