import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, Image, Animated } from 'react-native';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

function CommentsSkeleton() {
    const pulse = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={{ marginTop: 24 }}>
            {[1, 2, 3].map(i => (
                <Animated.View key={i} style={{
                    opacity: pulse,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 16,
                }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#e3e6f3', marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                        <View style={{ width: '70%', height: 14, backgroundColor: '#e3e6f3', borderRadius: 8, marginBottom: 6 }} />
                        <View style={{ width: '40%', height: 10, backgroundColor: '#e3e6f3', borderRadius: 8 }} />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}

const CommentsSection = ({ petId }) => {
    const { user } = useFirebaseAuth();
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        if (petId) fetchComments();
    }, [petId]);

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const q = query(
                collection(db, 'Pets', petId, 'Comments'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;
        setPosting(true);
        try {
            await addDoc(collection(db, 'Pets', petId, 'Comments'), {
                text: commentText,
                userId: user?.uid,
                userName: user?.displayName || 'Anonymous',
                userAvatar: user?.photoURL || '',
                createdAt: serverTimestamp(),
            });
            setCommentText('');
            fetchComments();
        } catch (e) {
            console.error('Error posting comment:', e);
        }
        setPosting(false);
    };

    return (
        <View style={{ marginTop: 32, marginHorizontal: 20 }}>
            <Text style={{
                fontFamily: 'PermanentMarker-Regular',
                fontSize: 20,
                color: '#667eea',
                marginBottom: 12
            }}>
                Comments & Questions
            </Text>

            {commentsLoading ? (
                <CommentsSkeleton />
            ) : comments.length === 0 ? (
                <Text style={{
                    color: '#999',
                    fontFamily: 'Pacifico-Regular',
                    marginBottom: 16
                }}>
                    No comments yet. Be the first to ask a question!
                </Text>
            ) : (
                comments.map(c => (
                    <View key={c.id} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16
                    }}>
                        <Image
                            source={{ uri: c.userAvatar || 'https://via.placeholder.com/36' }}
                            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontFamily: 'PermanentMarker-Regular',
                                color: '#333',
                                fontSize: 15
                            }}>
                                {c.userName}
                            </Text>
                            <Text style={{
                                color: '#555',
                                fontFamily: 'Pacifico-Regular',
                                fontSize: 13
                            }}>
                                {c.text}
                            </Text>
                        </View>
                    </View>
                ))
            )}

            {/* Add Comment Box */}
            {user && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Image
                        source={{ uri: user.photoURL || 'https://via.placeholder.com/36' }}
                        style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
                    />
                    <TextInput
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder="Ask a question or leave a comment..."
                        placeholderTextColor="#aaa"
                        style={{
                            flex: 1,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            fontSize: 15,
                            fontFamily: 'Pacifico-Regular',
                            color: '#333'
                        }}
                        editable={!posting}
                    />
                    <Pressable
                        onPress={handlePostComment}
                        disabled={posting || !commentText.trim()}
                        style={{ marginLeft: 8 }}
                    >
                        <LinearGradient colors={['#ff6b6b', '#667eea']} style={{ borderRadius: 20, padding: 8 }}>
                            <MaterialIcons name="send" size={20} color="white" />
                        </LinearGradient>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default CommentsSection; 