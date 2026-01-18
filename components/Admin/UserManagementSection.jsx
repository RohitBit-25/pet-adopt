import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

function getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
}

const UserManagementSection = ({ users, currentUser, actionLoading, updateUserRole }) => {
    const { t } = useTranslation();
    const [pendingAction, setPendingAction] = useState(null);

    const confirmAction = (uid, newRole, actionLabel) => {
        setPendingAction({ uid, newRole, actionLabel });
        Alert.alert(
            t('confirm'),
            t('areYouSure', 'Are you sure you want to ') + actionLabel + '?',
            [
                { text: t('cancel', 'Cancel'), style: 'cancel', onPress: () => setPendingAction(null) },
                { text: t('yes', 'Yes'), style: 'destructive', onPress: () => { updateUserRole(uid, newRole); setPendingAction(null); } },
            ]
        );
    };

    return (
        <FlatList
            data={users}
            keyExtractor={item => item.uid}
            renderItem={({ item }) => {
                const isSelf = currentUser && item.uid === currentUser.uid;
                return (
                    <View style={styles.userCard}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>{getInitials(item.displayName)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.userName}>{item.displayName || t('noName', 'No Name')}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                            <Text style={styles.userRole}>{t('role', 'Role')}: {item.role}</Text>
                        </View>
                        {!isSelf && (
                            <View style={styles.actionRow}>
                                {item.role !== 'banned' ? (
                                    <TouchableOpacity onPress={() => confirmAction(item.uid, 'banned', t('ban'))} style={styles.iconBtn}>
                                        <MaterialIcons name="block" size={24} color="#ff6b6b" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => confirmAction(item.uid, 'user', t('unban'))} style={styles.iconBtn}>
                                        <MaterialIcons name="check-circle" size={24} color="#4ecdc4" />
                                    </TouchableOpacity>
                                )}
                                {item.role !== 'admin' ? (
                                    <TouchableOpacity onPress={() => confirmAction(item.uid, 'admin', t('promote'))} style={styles.iconBtn}>
                                        <MaterialIcons name="arrow-upward" size={24} color="#667eea" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => confirmAction(item.uid, 'user', t('demote'))} style={styles.iconBtn}>
                                        <MaterialIcons name="arrow-downward" size={24} color="#888" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        {actionLoading === item.uid && <ActivityIndicator size="small" />}
                    </View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    userCard: {
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
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e0e7ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    avatarText: {
        fontSize: 20,
        color: '#667eea',
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 13,
        color: '#888',
    },
    userRole: {
        fontSize: 13,
        color: '#667eea',
        marginTop: 2,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconBtn: {
        marginHorizontal: 4,
        padding: 6,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
    },
});

export default UserManagementSection; 