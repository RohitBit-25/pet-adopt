import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StatsSection = ({ stats }) => (
    <View style={styles.statsRow}>
        <View style={styles.statCard}>
            <MaterialIcons name="pets" size={28} color="#667eea" />
            <Text style={styles.statValue}>{stats.pets}</Text>
            <Text style={styles.statLabel}>Total Pets</Text>
        </View>
        <View style={styles.statCard}>
            <MaterialIcons name="people" size={28} color="#ff6b6b" />
            <Text style={styles.statValue}>{stats.users}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
            <MaterialIcons name="chat" size={28} color="#ffd700" />
            <Text style={styles.statValue}>{stats.adoptions}</Text>
            <Text style={styles.statLabel}>Adoptions</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        padding: 20,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    statValue: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 22,
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontFamily: 'Pacifico-Regular',
        fontSize: 14,
        color: '#888',
    },
});

export default StatsSection; 