import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function UserItem({ userInfo }) {
    return (
        <View>
            <View style={styles.container}>
                <Image
                    source={{ uri: userInfo?.imageUrl || 'https://via.placeholder.com/40' }}
                    style={styles.avatar}
                />
                <Text style={styles.userName}>{userInfo?.name || 'Unknown User'}</Text>
            </View>
            <View style={styles.separator} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 7,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 99,
    },
    userName: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 20,
    },
    separator: {
        borderWidth: 0.5,
        marginVertical: 7,
        borderColor: 'gray',
        opacity: 0.5,
    },
});
