import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        if (!params?.id || !user?.primaryEmailAddress?.emailAddress) {
            console.warn("Missing chat ID or user email");
            return;
        }
        GetUserDetails();
        const unsubscribe = onSnapshot(collection(db, 'Chat', params?.id, 'Messages'), (snapshot) => {
            const messageData = snapshot.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            setMessages(messageData);
        });

        return () => unsubscribe();
    }, [params?.id, user, navigation]);

    const GetUserDetails = async () => {
        try {
            const docRef = doc(db, 'Chat', params?.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.warn('Chat document not found');
                return;
            }

            const result = docSnap.data();
            if (!result?.users || !Array.isArray(result.users)) {
                console.warn("No users array found in chat document");
                return;
            }

            const otherUser = result.users.find(
                item => item.email !== user?.primaryEmailAddress?.emailAddress
            );

            if (otherUser?.name) {
                navigation.setOptions({ headerTitle: otherUser.name });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;
        const newMessage = {
            text: inputMessage,
            createdAt: moment().format(),
            user: {
                _id: user?.primaryEmailAddress?.emailAddress,
                name: user?.fullName,
            }
        };

        await addDoc(collection(db, 'Chat', params.id, 'Messages'), newMessage);
        setInputMessage('');
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageContainer, item.user._id === user?.primaryEmailAddress?.emailAddress ? styles.sentMessage : styles.receivedMessage]}>
            {item.user._id !== user?.primaryEmailAddress?.emailAddress && (
                <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
            )}
            <View style={styles.bubble}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{moment(item.createdAt).fromNow()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                inverted
                renderItem={renderMessage}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    messageContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, margin: 5, borderRadius: 10, maxWidth: '80%' },
    bubble: { padding: 12, borderRadius: 20, backgroundColor: '#d1ecf1', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
    sentMessage: { alignSelf: 'flex-end', backgroundColor: '#b3e5fc', padding: 10, borderRadius: 15, borderBottomRightRadius: 5 },
    receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#e0f7fa', padding: 10, borderRadius: 15, borderBottomLeftRadius: 5 },
    messageText: { fontSize: 16, color: '#333' },
    timestamp: { fontSize: 12, color: 'gray', marginTop: 5, alignSelf: 'flex-end' },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff', alignItems: 'center' },
    input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#fff' },
    sendButton: { marginLeft: 10, backgroundColor: '#007AFF', borderRadius: 20, padding: 10, justifyContent: 'center', alignItems: 'center' }
});
