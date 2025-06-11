import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Category from './Category'
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import PetListItem from './PetListItem'
import { db } from '../../config/FirebaseConfig'
import {
    spacing,
    fontSize,
    deviceInfo,
    responsivePadding,
    grid
} from '../../utils/responsive';

export default function PetListCategory({ searchQuery = '' }) {
    const [petList, setPetList] = useState([]);
    const [allPets, setAllPets] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');
    const [error, setError] = useState(null);

    // Real-time pet fetching with Firebase onSnapshot
    const GetPetList = useCallback((category) => {
        setLoader(true);
        setError(null);
        setSelectedCategory(category);

        try {
            const q = query(
                collection(db, 'Pets'),
                where('Category', '==', category)
            );

            // Set up real-time listener
            const unsubscribe = onSnapshot(q,
                (querySnapshot) => {
                    const pets = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setAllPets(pets);
                    setPetList(pets);
                    setLoader(false);
                },
                (error) => {
                    console.error("Error fetching pets:", error);
                    setError("Failed to load pets. Please try again.");
                    setLoader(false);
                }
            );

            // Return unsubscribe function for cleanup
            return unsubscribe;
        } catch (error) {
            console.error("Error setting up pet listener:", error);
            setError("Failed to load pets. Please try again.");
            setLoader(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = GetPetList('Dogs');

        // Cleanup function
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [GetPetList]);

    // Filter pets based on search query
    useEffect(() => {
        if (searchQuery && searchQuery.length > 0) {
            const filtered = allPets.filter(pet =>
                pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pet.Category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pet.address?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setPetList(filtered);
        } else {
            setPetList(allPets);
        }
    }, [searchQuery, allPets]);

    const handleRefresh = () => {
        GetPetList(selectedCategory);
    };

    const renderEmptyComponent = () => {
        if (loader) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#667eea" />
                    <Text style={styles.loadingText}>Loading pets...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No pets found in this category.</Text>
                <Text style={styles.emptySubText}>Be the first to add a pet!</Text>
            </View>
        );
    };

    return (
        <View>
            <Category category={GetPetList} />
            <FlatList
                data={petList}
                horizontal={true}
                refreshing={loader}
                onRefresh={handleRefresh}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PetListItem pet={item} />}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={petList.length === 0 ? styles.emptyContainer : null}
            />
        </View>
    );
}

const styles = {
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: responsivePadding.horizontal,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: '#667eea',
        fontFamily: 'PermanentMarker-Regular',
    },
    errorText: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: '#ff6b6b',
        textAlign: 'center',
        fontFamily: 'PermanentMarker-Regular',
    },
    emptyText: {
        fontSize: deviceInfo.isTablet ? fontSize.title : fontSize.xl,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'PermanentMarker-Regular',
    },
    emptySubText: {
        fontSize: deviceInfo.isTablet ? fontSize.lg : fontSize.md,
        color: '#999',
        textAlign: 'center',
        marginTop: spacing.xs,
        fontFamily: 'Pacifico-Regular',
        lineHeight: deviceInfo.isTablet ? 24 : 20,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: deviceInfo.isTablet ? 300 : 200,
    },
};
