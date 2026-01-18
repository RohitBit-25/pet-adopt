import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useMyPets } from '../../hooks/useMyPets';
import Header from '../../components/MyPets/Header';
import PetCard from '../../components/MyPets/PetCard';
import EmptyState from '../../components/MyPets/EmptyState';

export default function MyPets() {
    const { myPets, loading, refreshing, handleRefresh, handleDeletePet } = useMyPets();

    const renderPetItem = ({ item }) => (
        <PetCard
            pet={item}
            onDelete={handleDeletePet}
        />
    );

    const renderEmptyState = () => <EmptyState />;

    return (
        <View style={styles.container}>
            <Header petCount={myPets.length} />

            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Loading your pets...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={myPets}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPetItem}
                        ListEmptyComponent={renderEmptyState}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={myPets.length === 0 ? styles.emptyListContainer : styles.listContainer}
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
});
