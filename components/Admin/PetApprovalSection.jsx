import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const PetApprovalSection = ({ pendingPets, loading, handleApprove, handleReject }) => {
    const confirmAction = (action, petId, petName) => {
        Alert.alert(
            action === 'approve' ? 'Approve Pet' : 'Reject Pet',
            `Are you sure you want to ${action} "${petName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', style: 'destructive', onPress: () => action === 'approve' ? handleApprove(petId) : handleReject(petId) },
            ]
        );
    };

    return (
        <View>
            <Text style={styles.header}>Pending Pet Approvals</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : pendingPets.length === 0 ? (
                <Text style={styles.emptyText}>No pending pets.</Text>
            ) : (
                <FlatList
                    data={pendingPets}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.petCard}>
                            <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.petName}>{item.name}</Text>
                                <Text style={styles.petBreed}>{item.breed}</Text>
                            </View>
                            <TouchableOpacity onPress={() => confirmAction('approve', item.id, item.name)} style={styles.iconBtn}>
                                <LinearGradient colors={['#4ecdc4', '#667eea']} style={styles.iconBtnGradient}>
                                    <MaterialIcons name="check" size={20} color="white" />
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmAction('reject', item.id, item.name)} style={styles.iconBtn}>
                                <LinearGradient colors={['#ff6b6b', '#ee5a52']} style={styles.iconBtnGradient}>
                                    <MaterialIcons name="close" size={20} color="white" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#ff6b6b',
    },
    emptyText: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
        marginVertical: 16,
    },
    petCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 14,
        backgroundColor: '#e0e7ff',
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    petBreed: {
        fontSize: 13,
        color: '#888',
    },
    iconBtn: {
        marginHorizontal: 4,
        borderRadius: 16,
        overflow: 'hidden',
    },
    iconBtnGradient: {
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PetApprovalSection; 