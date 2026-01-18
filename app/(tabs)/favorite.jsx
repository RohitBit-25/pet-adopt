import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Pressable, Animated } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Shared from '../../Shared/Shared';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PetListItem from '../../components/Home/PetListItem';
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
    components,
    grid
} from '../../utils/responsive';

function FavoriteSkeletonCard() {
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
        <Animated.View style={[styles.skeletonContainer, { opacity: pulse }]}>
            <LinearGradient
                colors={['#f0f2f5', '#e3e6f3']}
                style={styles.skeletonGradient}
            >
                <View style={styles.skeletonInner}>
                    <View style={styles.skeletonAvatar} />
                    <View style={styles.skeletonTextContainer}>
                        <View style={styles.skeletonTextLong} />
                        <View style={styles.skeletonTextShort} />
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

export default function Favorite() {
    const { user } = useFirebaseAuth();
    const [favPetList, setFavPetList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavoritePets = async () => {
        setLoading(true);
        try {
            const favResult = await Shared.GetFavList(user);
            const favIds = favResult?.favorites || [];

            if (favIds.length > 0) {
                const q = query(collection(db, 'Pets'), where('id', 'in', favIds));
                const querySnapshot = await getDocs(q);
                const pets = querySnapshot.docs.map(doc => doc.data());
                setFavPetList(pets);
            } else {
                setFavPetList([]);
            }
        } catch (error) {
            console.error("Error fetching favorite pets:", error);
            // Optionally set an error state here
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchFavoritePets();
            }
        }, [user])
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyIconContainer}
            >
                <MaterialIcons name="favorite-border" size={60} color="white" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start exploring and save your favorite pets to see them here
            </Text>
            <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/home')}
            >
                <LinearGradient
                    colors={['#ff6b6b', '#667eea']}
                    style={styles.exploreButtonGradient}
                >
                    <MaterialIcons name="pets" size={20} color="white" />
                    <Text style={styles.exploreButtonText}>Find Pets</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <HeaderComponent favPetCount={0} />
                <View style={styles.contentContainer}>
                    <FlatList
                        data={Array(6).fill(0)}
                        numColumns={2}
                        renderItem={() => <FavoriteSkeletonCard />}
                        keyExtractor={(_, index) => `skeleton-${index}`}
                        columnWrapperStyle={styles.row}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderComponent favPetCount={favPetList.length} />

            <View style={styles.contentContainer}>
                <FlatList
                    data={favPetList}
                    numColumns={2}
                    onRefresh={fetchFavoritePets}
                    refreshing={loading}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <View style={styles.petItemContainer}><PetListItem pet={item} /></View>}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={favPetList.length === 0 ? styles.emptyListContainer : styles.listContainer}
                    columnWrapperStyle={favPetList.length > 0 ? styles.row : null}
                />
            </View>
        </View>
    );
}

const HeaderComponent = ({ favPetCount }) => (
    <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
    >
        <View style={styles.headerContent}>
            <MaterialIcons name="favorite" size={32} color="white" />
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>My Favorites</Text>
                <Text style={styles.headerSubtitle}>
                    {favPetCount} {favPetCount === 1 ? 'pet' : 'pets'} saved
                </Text>
            </View>
        </View>
    </LinearGradient>
);

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
    row: {
        justifyContent: 'space-between',
    },
    petItemContainer: {
        width: '48%',
        marginBottom: spacing.md,
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
    skeletonContainer: {
        borderRadius: 20,
        marginBottom: 16,
        backgroundColor: 'transparent',
        width: '48%',
    },
    skeletonGradient: {
        borderRadius: 20,
        padding: 2,
    },
    skeletonInner: {
        backgroundColor: 'white',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    skeletonAvatar: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#e3e6f3',
        marginRight: 16,
    },
    skeletonTextContainer: {
        flex: 1,
    },
    skeletonTextLong: {
        width: '80%',
        height: 18,
        backgroundColor: '#e3e6f3',
        borderRadius: 8,
        marginBottom: 8,
    },
    skeletonTextShort: {
        width: '50%',
        height: 14,
        backgroundColor: '#e3e6f3',
        borderRadius: 8,
    },
});
