import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import StatsSection from '../../components/Admin/StatsSection';
import UserManagementSection from '../../components/Admin/UserManagementSection';
import PetApprovalSection from '../../components/Admin/PetApprovalSection';
import EventManagementSection from '../../components/Admin/EventManagementSection';

const TABS = [
    { key: 'users', label: 'Users' },
    { key: 'events', label: 'Events' },
    { key: 'pets', label: 'Pets' },
];

export default function AdminDashboard() {
    const { user, userRole } = useFirebaseAuth();
    const [pendingPets, setPendingPets] = useState([]);
    const [stats, setStats] = useState({ pets: 0, users: 0, adoptions: 0 });
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [tab, setTab] = useState('users');

    const fetchDashboardData = useCallback(async () => {
        if (userRole !== 'admin') return;
        setLoading(true);
        try {
            const [petsSnap, usersSnap, adoptionsSnap, pendingPetsSnap, eventsSnap] = await Promise.all([
                getDocs(collection(db, 'Pets')),
                getDocs(collection(db, 'Users')),
                getDocs(collection(db, 'Chat')),
                getDocs(query(collection(db, 'Pets'), where('approved', '==', false))),
                getDocs(collection(db, 'events')),
            ]);
            setStats({ pets: petsSnap.size, users: usersSnap.size, adoptions: adoptionsSnap.size });
            setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            setPendingPets(pendingPetsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            setEvents(eventsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error("Error fetching admin data:", e);
            Alert.alert("Error", "Could not fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    useFocusEffect(fetchDashboardData);

    const handleApprove = async (petId) => {
        setPendingPets(prev => prev.filter(p => p.id !== petId)); // Optimistic update
        try {
            await updateDoc(doc(db, 'Pets', petId), { approved: true });
            Alert.alert('Approved', 'Pet listing approved!');
        } catch (e) {
            Alert.alert('Error', 'Could not approve pet.');
            fetchDashboardData(); // Re-fetch on error to revert state
        }
    };

    const handleReject = async (petId) => {
        setPendingPets(prev => prev.filter(p => p.id !== petId)); // Optimistic update
        try {
            // In a real app, you might move this to a 'rejected' collection
            // For now, we just delete it from the DB
            await deleteDoc(doc(db, 'Pets', petId));
            Alert.alert('Rejected', 'Pet listing rejected and removed.');
        } catch (e) {
            Alert.alert('Error', 'Could not reject pet.');
            fetchDashboardData(); // Re-fetch on error
        }
    };

    const updateUserRole = async (uid, newRole) => {
        setActionLoading(uid);
        const originalUsers = users;
        setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
        try {
            await updateDoc(doc(db, 'Users', uid), { role: newRole });
            Alert.alert('Success', `User role updated to ${newRole}`);
        } catch (error) {
            setUsers(originalUsers); // Revert on error
            Alert.alert('Error', 'Could not update user role.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId)); // Optimistic update
        try {
            await deleteDoc(doc(db, 'events', eventId));
            Alert.alert('Deleted', 'Event deleted.');
        } catch (e) {
            Alert.alert('Error', 'Could not delete event.');
            fetchDashboardData(); // Re-fetch on error
        }
    };

    const handleEditEvent = (event) => {
        Alert.alert('Edit Event', `This would open an edit screen for: ${event.title}`);
    };

    if (userRole !== 'admin') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Admin Access Only</Text>
                <Text style={styles.subtitle}>You do not have permission to view this page.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <StatsSection stats={stats} loading={loading} />
            <View style={styles.tabRow}>
                {TABS.map(tabItem => (
                    <TouchableOpacity
                        key={tabItem.key}
                        style={[styles.tabButton, tab === tabItem.key && styles.tabButtonActive]}
                        onPress={() => setTab(tabItem.key)}
                    >
                        <Text style={[styles.tabButtonText, tab === tabItem.key && styles.tabButtonTextActive]}>{tabItem.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ flex: 1 }}>
                {tab === 'users' && (
                    <UserManagementSection
                        users={users}
                        currentUser={user}
                        actionLoading={actionLoading}
                        updateUserRole={updateUserRole}
                        loading={loading}
                    />
                )}
                {tab === 'events' && (
                    <EventManagementSection
                        events={events}
                        loading={loading}
                        handleDelete={handleDeleteEvent}
                        handleEdit={handleEditEvent}
                    />
                )}
                {tab === 'pets' && (
                    <PetApprovalSection
                        pendingPets={pendingPets}
                        loading={loading}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
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
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 28,
        color: '#667eea',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Pacifico-Regular',
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#e0e7ff',
        marginHorizontal: 6,
    },
    tabButtonActive: {
        backgroundColor: '#667eea',
    },
    tabButtonText: {
        color: '#667eea',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tabButtonTextActive: {
        color: 'white',
    },
}); 