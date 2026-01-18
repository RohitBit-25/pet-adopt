import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

const EventCard = ({ event, onRSVP, isRsvping, user }) => {
    const { t } = useTranslation();
    const isGoing = event.attendees?.includes(user?.uid);
    const eventDate = event.date?.seconds ? new Date(event.date.seconds * 1000).toLocaleDateString() : t('dateTbd');

    return (
        <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetails}>{eventDate} {t('at')} {event.time || t('timeTbd')}</Text>
            <Text style={styles.eventDetails}>{event.location || t('locationTbd')}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
            {user && (
                <TouchableOpacity
                    style={[styles.rsvpButton, isGoing ? styles.cancelButton : styles.rsvpButtonActive]}
                    onPress={() => onRSVP(event.id, isGoing)}
                    disabled={isRsvping}
                >
                    {isRsvping ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.rsvpButtonText}>{isGoing ? t('cancelRsvp') : t('rsvp')}</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 8,
    },
    eventDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    eventDescription: {
        fontSize: 14,
        marginTop: 8,
    },
    rsvpButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
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
});

export default EventCard; 