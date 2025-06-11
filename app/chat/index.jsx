import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import moment from 'moment';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components,
    SCREEN_WIDTH
} from '../../utils/responsive';

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (!params?.id || !user?.primaryEmailAddress?.emailAddress) {
            console.warn("Missing chat ID or user email");
            Alert.alert("Error", "Chat information is missing. Please try again.");
            navigation.goBack();
            return;
        }

        GetUserDetails();

        // Set up real-time message listener with proper ordering
        const messagesQuery = query(
            collection(db, 'Chat', params?.id, 'Messages'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(messagesQuery,
            (snapshot) => {
                const messageData = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }));
                setMessages(messageData);
            },
            (error) => {
                console.error("Error listening to messages:", error);
                Alert.alert("Error", "Failed to load messages. Please check your connection.");
            }
        );

        return () => unsubscribe();
    }, [params?.id, user, navigation]);

    const GetUserDetails = async () => {
        try {
            const docRef = doc(db, 'Chat', params?.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.warn('Chat document not found');
                Alert.alert("Error", "Chat not found. Please try again.");
                navigation.goBack();
                return;
            }

            const result = docSnap.data();
            if (!result?.users || !Array.isArray(result.users)) {
                console.warn("No users array found in chat document");
                return;
            }

            const foundOtherUser = result.users.find(
                item => item.email !== user?.primaryEmailAddress?.emailAddress
            );

            if (foundOtherUser) {
                setOtherUser(foundOtherUser);
                navigation.setOptions({
                    headerTitle: foundOtherUser.name || 'Chat',
                    headerTitleStyle: {
                        fontFamily: 'PermanentMarker-Regular',
                        fontSize: 18,
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert("Error", "Failed to load chat details.");
        }
    };

    const sendMessage = async () => {
        const messageText = inputMessage.trim();
        if (!messageText) return;

        setIsSending(true);
        setInputMessage(''); // Clear input immediately for better UX

        try {
            const newMessage = {
                text: messageText,
                createdAt: moment().format(),
                user: {
                    _id: user?.primaryEmailAddress?.emailAddress,
                    name: user?.fullName,
                    imageUrl: user?.imageUrl,
                }
            };

            await addDoc(collection(db, 'Chat', params.id, 'Messages'), newMessage);

            // Scroll to bottom after sending
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 100);

        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert("Error", "Failed to send message. Please try again.");
            setInputMessage(messageText); // Restore message on error
        } finally {
            setIsSending(false);
        }
    };

    const renderMessage = ({ item, index }) => {
        const isMyMessage = item.user._id === user?.primaryEmailAddress?.emailAddress;
        const showAvatar = !isMyMessage && (index === 0 || messages[index - 1]?.user._id !== item.user._id);
        const showTimestamp = index === 0 || moment(item.createdAt).diff(moment(messages[index - 1]?.createdAt), 'minutes') > 5;

        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.sentMessageContainer : styles.receivedMessageContainer]}>
                {!isMyMessage && (
                    <View style={styles.avatarContainer}>
                        {showAvatar ? (
                            <Image
                                source={{ uri: otherUser?.imageUrl || 'https://via.placeholder.com/40' }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarSpacer} />
                        )}
                    </View>
                )}

                <View style={[styles.bubble, isMyMessage ? styles.sentBubble : styles.receivedBubble]}>
                    <Text style={[styles.messageText, isMyMessage ? styles.sentMessageText : styles.receivedMessageText]}>
                        {item.text}
                    </Text>
                    {showTimestamp && (
                        <Text style={[styles.timestamp, isMyMessage ? styles.sentTimestamp : styles.receivedTimestamp]}>
                            {moment(item.createdAt).format('HH:mm')}
                        </Text>
                    )}
                </View>

                {isMyMessage && (
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: user?.imageUrl || 'https://via.placeholder.com/40' }}
                            style={styles.avatar}
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                inverted
                renderItem={renderMessage}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messagesList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="chat" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Start your conversation</Text>
                        <Text style={styles.emptySubText}>Send a message to begin chatting</Text>
                    </View>
                }
            />

            {isTyping && (
                <View style={styles.typingIndicator}>
                    <Text style={styles.typingText}>{otherUser?.name} is typing...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputMessage.trim() || isSending) && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!inputMessage.trim() || isSending}
                    >
                        {isSending ? (
                            <MaterialIcons name="hourglass-empty" size={20} color="white" />
                        ) : (
                            <Ionicons name="send" size={20} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 2,
        paddingHorizontal: 4,
    },
    sentMessageContainer: {
        justifyContent: 'flex-end',
    },
    receivedMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 40,
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarSpacer: {
        width: 32,
        height: 32,
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    sentBubble: {
        backgroundColor: '#667eea',
        borderBottomRightRadius: 6,
    },
    receivedBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 6,
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    sentMessageText: {
        color: 'white',
    },
    receivedMessageText: {
        color: '#333',
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    sentTimestamp: {
        color: 'rgba(255,255,255,0.8)',
        alignSelf: 'flex-end',
    },
    receivedTimestamp: {
        color: '#999',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e1e5e9',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f8f9fa',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: {
        marginLeft: 12,
        backgroundColor: '#667eea',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#667eea',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        transform: [{ scaleY: -1 }], // Flip back since FlatList is inverted
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        fontFamily: 'PermanentMarker-Regular',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        fontFamily: 'Pacifico-Regular',
    },
    typingIndicator: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
    },
    typingText: {
        fontSize: 14,
        color: '#667eea',
        fontStyle: 'italic',
        fontFamily: 'Pacifico-Regular',
    },
});
