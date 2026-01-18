import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing } from '../../utils/responsive';

export default function StarRating({ rating, onRate, size = 30, color = '#f1c40f' }) {
    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => onRate(i)}>
                    <MaterialIcons
                        name={i <= rating ? 'star' : 'star-border'}
                        size={size}
                        color={color}
                        style={styles.star}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    star: {
        marginHorizontal: spacing.xs,
    },
}); 