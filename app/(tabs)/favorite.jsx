import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from '../../Shared/Shared';
import { useUser } from '@clerk/clerk-expo';
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

export default function Favorite() {
    const { user } = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    // Fetch favorite pet IDs
    useEffect(() => {
        if (user) GetFavPetIds();
    }, [user]);

    const GetFavPetIds = async () => {
        setLoader(true);
        const result = await Shared.GetFavList(user);
        setFavIds(result?.favorites || []);
        setLoader(false);
    };

    // Fetch favorite pet details when `favIds` updates
    useEffect(() => {
        if (favIds.length > 0) {
            GetFavPetList();
        } else {
            setFavPetList([]); // Reset when there are no favorites
        }
    }, [favIds]);

    const GetFavPetList = async () => {
        setLoader(true);
        try {
            const q = query(collection(db, 'Pets'), where('id', 'in', favIds));
            const querySnapshot = await getDocs(q);

            const pets = [];
            querySnapshot.forEach((doc) => {
                pets.push(doc.data());
            });

            setFavPetList(pets);
        } catch (error) {
            console.error("Error fetching favorite pets:", error);
        }
        setLoader(false);
    };

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
                    colors={['#667eea', '#764ba2']}
                    style={styles.exploreButtonGradient}
                >
                    <MaterialIcons name="explore" size={20} color="white" />
                    <Text style={styles.exploreButtonText}>Explore Pets</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderPetItem = ({ item, index }) => (
        <View style={styles.petItemContainer}>
            <PetListItem pet={item} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <MaterialIcons name="favorite" size={32} color="white" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>My Favorites</Text>
                        <Text style={styles.headerSubtitle}>
                            {favPetList.length} {favPetList.length === 1 ? 'pet' : 'pets'} saved
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.contentContainer}>
                {loader ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Loading your favorites...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={favPetList}
                        numColumns={2}
                        onRefresh={GetFavPetIds}
                        refreshing={loader}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPetItem}
                        ListEmptyComponent={renderEmptyState}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={favPetList.length === 0 ? styles.emptyListContainer : styles.listContainer}
                        columnWrapperStyle={favPetList.length > 0 ? styles.row : null}
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
        justifyContent: 'space-around',
    },
    petItemContainer: {
        flex: 1,
        margin: 5,
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
});
