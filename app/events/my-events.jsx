import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import EventCard from '../../components/Events/EventCard';
import EventListSkeleton from '../../components/Events/EventListSkeleton';

const MyEventsScreen = () => {
    const { user } = useFirebaseAuth();
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(null);

    const fetchMyEvents = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, where('attendees', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);
            const myEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(myEvents);
        } catch (error) {
            console.error('Error fetching my events:', error);
            Alert.alert(t('error'), t('errorFetchingEvents'));
        } finally {
            setLoading(false);
        }
    }, [user, t]);

    useFocusEffect(
        useCallback(() => {
            fetchMyEvents();
        }, [fetchMyEvents])
    );

    const handleRSVP = useCallback(async (eventId, isGoing) => {
        if (!user) return;
        setRsvpLoading(eventId);
        try {
            const eventRef = doc(db, 'events', eventId);
            const operation = isGoing ? arrayRemove : arrayUnion;
            await updateDoc(eventRef, { attendees: operation(user.uid) });
            // Since this is "My Events", cancelling RSVP should remove it from the list.
            if (isGoing) {
                setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
            }
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
                <Text style={styles.title}>{t('myEvents')}</Text>
                <EventListSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('myEvents')}</Text>
            {events.length === 0 ? (
                <Text style={styles.noEventsText}>{t('noMyEvents', 'You have not RSVPed to any events yet.')}</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                />
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
    noEventsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default MyEventsScreen; 