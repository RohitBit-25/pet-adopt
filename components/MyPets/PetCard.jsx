import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

const PetCard = ({ pet, onDelete, onEdit }) => {
    const handleEdit = () => {
        Alert.alert('Coming Soon', 'Edit functionality will be available soon!');
    };

    return (
        <View style={styles.petCard}>
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />

            <View style={styles.petInfo}>
                <View style={styles.petHeader}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{pet.Category}</Text>
                    </View>
                </View>

                <Text style={styles.petDetails}>
                    {pet.breed} • {pet.age} years • {pet.weight}kg
                </Text>

                <Text style={styles.petLocation}>
                    <MaterialIcons name="location-on" size={14} color="#666" />
                    {pet.address}
                </Text>

                <Text style={styles.petDate}>
                    Listed {moment(pet.createdAt).fromNow()}
                </Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                >
                    <MaterialIcons name="edit" size={20} color="#667eea" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(pet.id, pet.name)}
                >
                    <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    petCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    petInfo: {
        flex: 1,
    },
    petHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'PermanentMarker-Regular',
        flex: 1,
    },
    categoryBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    petDetails: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        marginBottom: 4,
    },
    petLocation: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        marginBottom: 4,
    },
    petDate: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Pacifico-Regular',
    },
    actionButtons: {
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: 16,
    },
    editButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginBottom: 8,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#ffe6e6',
    },
});

export default PetCard; 