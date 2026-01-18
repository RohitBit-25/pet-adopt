import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { useChat } from '../../hooks/useChat';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen() {
    const { id: chatId } = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useFirebaseAuth();
    const { messages, otherUser, loading, onSend } = useChat(chatId, navigation);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text>Start your conversation with {otherUser?.name || 'them'}</Text>
        </View>
    );

    if (loading || !otherUser) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#667eea" />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: user?.email,
                    name: user?.displayName,
                    avatar: user?.photoURL,
                }}
                renderAvatarOnTop
                showUserAvatar
                messagesContainerStyle={{ paddingBottom: 10 }}
                renderLoading={() => <ActivityIndicator size="large" color="#667eea" />}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scaleY: -1 }]
    }
});
