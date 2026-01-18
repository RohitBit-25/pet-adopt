import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import { withSafeComponent } from '../Common/SafeComponent'
import PetListItem from './PetListItem'
import EmptyState from '../Common/EmptyState'
import Loader from '../Common/Loader'
import colors from '../../theme/colors'
import typography from '../../theme/typography'
import {
    spacing,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding
} from '../../utils/responsive'

function PetListCategory({ category, title, subtitle, showViewAll = true, refreshSignal }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPets();
    }, [category]);

    useEffect(() => {
        if (refreshSignal !== undefined) {
            fetchPets();
        }
    }, [refreshSignal]);

    const fetchPets = async () => {
        setLoading(true);
        setError(null);

        try {
            let petsQuery = collection(db, 'Pets');

            // Add category filter if specified
            if (category && category !== 'all') {
                petsQuery = query(
                    petsQuery,
                    where('category', '==', category.toLowerCase())
                );
            }

            // Add ordering and limit
            petsQuery = query(
                petsQuery,
                orderBy('createdAt', 'desc'),
                limit(10)
            );

            const querySnapshot = await getDocs(petsQuery);
            const petsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPets(petsData);
        } catch (error) {
            console.error('Error fetching pets:', error);
            setError('Failed to load pets');
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = (petId, isFavorite) => {
        setPets(prevPets =>
            prevPets.map(pet =>
                pet.id === petId
                    ? { ...pet, isFavorite }
                    : pet
            )
        );
    };

    const renderPetItem = ({ item }) => (
        <PetListItem
            item={item}
            onFavoriteToggle={handleFavoriteToggle}
        />
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title || 'Available Pets'}</Text>
                {subtitle && (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                )}
            </View>
            {showViewAll && (
                <TouchableOpacity
                    style={styles.viewAllButton}
                    accessibilityRole="button"
                    accessibilityLabel="View all pets"
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );

    const renderEmptyState = () => (
        <EmptyState
            title="No Pets Found"
            message={category ? `No ${category} pets available at the moment` : "No pets available at the moment"}
            icon="pets"
            actionText="Refresh"
            onAction={fetchPets}
        />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <Loader size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <EmptyState
                    title="Error Loading Pets"
                    message={error}
                    icon="error"
                    actionText="Try Again"
                    onAction={fetchPets}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}

            {pets.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={pets}
                    renderItem={renderPetItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: responsivePadding.horizontal,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.fontSize.h3,
        color: colors.text,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.accent,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.sm,
        ...shadow.small,
    },
    viewAllText: {
        fontSize: typography.fontSize.body,
        color: colors.primary,
        fontFamily: typography.fontFamily.accent,
        fontWeight: typography.fontWeight.bold,
    },
    listContainer: {
        paddingHorizontal: responsivePadding.horizontal,
    },
    separator: {
        height: spacing.md,
    },
});

export default withSafeComponent(PetListCategory);
