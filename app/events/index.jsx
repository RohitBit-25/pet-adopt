import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import EventCard from '../../components/Events/EventCard';
import EventListSkeleton from '../../components/Events/EventListSkeleton';

const EventsScreen = () => {
    const router = useRouter();
    const { user, userRole } = useFirebaseAuth();
    const isAdmin = userRole === 'admin';
    const { t } = useTranslation();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'events'));
            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
            Alert.alert(t('error'), t('errorFetchingEvents'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [fetchEvents])
    );

    const handleRSVP = useCallback(async (eventId, isGoing) => {
        if (!user) return;
        setRsvpLoading(eventId);
        try {
            const eventRef = doc(db, 'events', eventId);
            const operation = isGoing ? arrayRemove : arrayUnion;
            await updateDoc(eventRef, { attendees: operation(user.uid) });

            setEvents(prevEvents =>
                prevEvents.map(event => {
                    if (event.id === eventId) {
                        const currentAttendees = event.attendees || [];
                        const newAttendees = isGoing
                            ? currentAttendees.filter(uid => uid !== user.uid)
                            : [...currentAttendees, user.uid];
                        return { ...event, attendees: newAttendees };
                    }
                    return event;
                })
            );
        } catch (error) {
            console.error('Error updating RSVP:', error);
            Alert.alert(t('error'), t('errorRsvp'));
        } finally {
            setRsvpLoading(null);
        }
    }, [user, t]);

    const renderItem = ({ item }) => (
        <EventCard
            event={item}
            onRSVP={handleRSVP}
            isRsvping={rsvpLoading === item.id}
            user={user}
        />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{t('events')}</Text>
                <EventListSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('events')}</Text>
            {events.length === 0 ? (
                <Text style={styles.noEventsText}>{t('noEvents', 'No events yet.')}</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            )}
            {isAdmin && (
                <TouchableOpacity style={styles.adminButton} onPress={() => router.push('/events/admin')}>
                    <Text style={styles.adminButtonText}>{t('createEvent')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    eventContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rsvpButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    rsvpButtonActive: {
        backgroundColor: '#007BFF',
    },
    cancelButton: {
        backgroundColor: '#FFA500',
    },
    rsvpButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    adminButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 30,
        elevation: 5,
    },
    adminButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noEventsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    }
});

export default EventsScreen; 