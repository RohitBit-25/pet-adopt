import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EventManagementSection = ({ events, loading, handleDelete, handleEdit }) => {
    const confirmDelete = (eventId, title) => {
        Alert.alert(
            'Delete Event',
            `Are you sure you want to delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(eventId) },
            ]
        );
    };

    return (
        <View>
            <Text style={styles.header}>Event Management</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : events.length === 0 ? (
                <Text style={styles.emptyText}>No events found.</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.eventCard}>
                            <View style={styles.iconCircle}>
                                <MaterialIcons name="event" size={24} color="#667eea" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventTitle}>{item.title}</Text>
                                <Text style={styles.eventDate}>{item.date} at {item.time}</Text>
                                <Text style={styles.eventLocation}>{item.location}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconBtn}>
                                <MaterialIcons name="edit" size={22} color="#ffd700" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(item.id, item.title)} style={styles.iconBtn}>
                                <MaterialIcons name="delete" size={22} color="#ff6b6b" />
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
        color: '#667eea',
    },
    emptyText: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
        marginVertical: 16,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e7ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    eventDate: {
        fontSize: 13,
        color: '#888',
    },
    eventLocation: {
        fontSize: 13,
        color: '#667eea',
        marginTop: 2,
    },
    iconBtn: {
        marginHorizontal: 4,
        padding: 6,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
    },
});

export default EventManagementSection;
