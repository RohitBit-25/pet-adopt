<<<<<<< HEAD
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import UserItem from '../../components/Inbox/UserItem';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components
} from '../../utils/responsive';

const UserItemSkeleton = () => {
    const pulse = useRef(new Animated.Value(0.6)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.skeletonUserItem, { opacity: pulse }]}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonUserInfo}>
                <View style={styles.skeletonUserName} />
                <View style={styles.skeletonUserMessage} />
            </View>
        </Animated.View>
    );
};

export default function Inbox() {
    const { user } = useFirebaseAuth();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserList = useCallback(async () => {
        setLoading(true);
        try {
            const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            if (!userEmail) {
                console.warn("User email is undefined.");
                setUserList([]);
                return;
            }

            const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));
            const querySnapshot = await getDocs(q);
=======
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import UserItem from '../../components/Inbox/UserItem';

export default function Inbox() {
    const { user } = useUser();
    const [userList, setUserList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (user) {
            console.log("User Email:", user?.primaryEmailAddress?.emailAddress);
            GetUserList();
        }
    }, [user]);

    const GetUserList = async () => {
        setLoader(true);
        try {
            const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            console.log("Querying Firestore with email:", userEmail);

            if (!userEmail) {
                console.warn("User email is undefined.");
                setLoader(false);
                return;
            }

            // Querying Firestore where userEmail exists in userIds array
            const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));
            const querySnapshot = await getDocs(q);
            console.log("Query Snapshot Size:", querySnapshot.size);

>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
            const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserList(users);
        } catch (error) {
            console.error('Error fetching user list:', error);
        } finally {
<<<<<<< HEAD
            setLoading(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchUserList();
            }
        }, [user, fetchUserList])
    );

    const mappedUsers = useMemo(() => {
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
        if (!currentUserEmail) return [];

        return userList
=======
            setLoader(false);
        }
    };

    const MapOtherUserList = () => {
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

        const mappedUsers = userList
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
            .map((record) => {
                if (!record.users || !Array.isArray(record.users)) {
                    console.warn("Invalid users array in record:", record);
                    return null;
                }
<<<<<<< HEAD
=======

                // Find the other user details in the chat
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
                const otherUser = record.users.find(u => u.email.toLowerCase() !== currentUserEmail);
                if (!otherUser) {
                    console.warn("No other user found in chat record:", record);
                    return null;
                }
<<<<<<< HEAD
=======

>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
                return {
                    docId: record.id,
                    email: otherUser.email,
                    name: otherUser.name,
                    imageUrl: otherUser.imageUrl
                };
            })
            .filter(Boolean);
<<<<<<< HEAD
    }, [userList, user]);


    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyIconContainer}
            >
                <MaterialIcons name="chat-bubble-outline" size={60} color="white" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No Conversations Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start chatting with pet owners by clicking "Adopt Me" on any pet
            </Text>
            <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/home')}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.exploreButtonGradient}
                >
                    <MaterialIcons name="pets" size={20} color="white" />
                    <Text style={styles.exploreButtonText}>Find Pets</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <MaterialIcons name="chat" size={32} color="white" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Inbox</Text>
                        <Text style={styles.headerSubtitle}>
                            {mappedUsers.length} {mappedUsers.length === 1 ? 'conversation' : 'conversations'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchUserList}
                        disabled={loading}
                    >
                        <MaterialIcons name="refresh" size={24} color={loading ? 'rgba(255,255,255,0.5)' : 'white'} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {loading ? (
                    <FlatList
                        data={Array(8).fill(0)}
                        keyExtractor={(_, index) => `skeleton-${index}`}
                        renderItem={() => <UserItemSkeleton />}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={mappedUsers}
                        keyExtractor={(item) => item.docId}
                        refreshing={loading}
                        onRefresh={fetchUserList}
                        renderItem={({ item }) => <UserItem userInfo={item} />}
                        ListEmptyComponent={renderEmptyState}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={mappedUsers.length === 0 ? styles.emptyListContainer : styles.listContainer}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Pacifico-Regular',
        marginTop: 4,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#667eea',
        fontFamily: 'PermanentMarker-Regular',
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    exploreButton: {
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    exploreButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
    },
    exploreButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PermanentMarker-Regular',
    },
    skeletonUserItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: '#f0f2f5',
        borderRadius: 12,
        marginBottom: spacing.md,
    },
    skeletonAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e0e0e0',
        marginRight: spacing.md,
    },
    skeletonUserInfo: {
        flex: 1,
    },
    skeletonUserName: {
        width: '60%',
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: spacing.sm,
    },
    skeletonUserMessage: {
        width: '80%',
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
});
=======

        console.log("Mapped Users List:", mappedUsers);
        return mappedUsers;
    };


    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'PermanentMarker-Regular', fontSize: 30 }}>Inbox</Text>
            {loader ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={MapOtherUserList()}
                    keyExtractor={(item) => item.docId}
                    refreshing={loader}
                    onRefresh={GetUserList}
                    style={{ marginTop: 20 }}
                    renderItem={({ item }) => <UserItem userInfo={item} />}
                />
            )}
        </View>
    );
}
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
