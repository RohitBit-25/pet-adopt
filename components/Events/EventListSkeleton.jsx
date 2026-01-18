import React from 'react';
import { View, StyleSheet } from 'react-native';

const SkeletonPlaceholder = () => (
    <View style={styles.placeholderContainer}>
        <View style={[styles.placeholder, { width: '70%', height: 20, marginBottom: 10 }]} />
        <View style={[styles.placeholder, { width: '50%', height: 15, marginBottom: 5 }]} />
        <View style={[styles.placeholder, { width: '40%', height: 15, marginBottom: 15 }]} />
        <View style={[styles.placeholder, { width: '100%', height: 40 }]} />
    </View>
);

const EventListSkeleton = ({ count = 3 }) => {
    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonPlaceholder key={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    placeholderContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    placeholder: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
});

export default EventListSkeleton; 