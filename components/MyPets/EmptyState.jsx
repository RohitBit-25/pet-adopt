import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const EmptyState = () => {
    return (
        <View style={styles.emptyContainer}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyIconContainer}
            >
                <MaterialIcons name="pets" size={60} color="white" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No Pets Listed Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start by adding your first pet to help them find a loving home
            </Text>
            <TouchableOpacity
                style={styles.addPetButton}
                onPress={() => router.push('/add-new-pet')}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.addPetButtonGradient}
                >
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
    addPetButton: {
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    addPetButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
    },
    addPetButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PermanentMarker-Regular',
    },
});

export default EmptyState; 