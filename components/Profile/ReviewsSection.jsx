import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated, Alert, Image } from 'react-native';
import { collection, query, getDocs, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { spacing, fontSize, borderRadius, shadow } from '../../utils/responsive';
import { MaterialIcons } from '@expo/vector-icons';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';

const ReviewItem = ({ review }) => {
    const timeAgo = review.createdAt?.toDate ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : 'Just now';

    return (
        <View style={styles.reviewItem}>
            <Image source={{ uri: review.reviewerAvatar || 'https://via.placeholder.com/150' }} style={styles.reviewerAvatar} />
            <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                    <Text style={styles.reviewTimestamp}>{timeAgo}</Text>
                </View>
                <StarRating rating={review.rating} size={16} onRate={() => { }} />
                <Text style={styles.reviewText}>{review.text}</Text>
            </View>
        </View>
    );
};

const ReviewsSkeleton = () => {
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
        <View>
            {[1, 2].map(i => (
                <Animated.View key={i} style={[styles.reviewItem, { opacity: pulse }]}>
                    <View style={[styles.reviewerAvatar, styles.skeletonElement]} />
                    <View style={styles.reviewContent}>
                        <View style={[styles.skeletonElement, { width: '40%', height: 16, marginBottom: 8 }]} />
                        <View style={[styles.skeletonElement, { width: '20%', height: 12, marginBottom: 8 }]} />
                        <View style={[styles.skeletonElement, { width: '90%', height: 40 }]} />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
};

export default function ReviewsSection({ user }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [posting, setPosting] = useState(false);

    const fetchReviews = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'Users', user.uid, 'Reviews'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
            console.error("Error fetching reviews:", e);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handlePostReview = async () => {
        if (!reviewText.trim()) return;
        setPosting(true);

        const newReview = {
            id: `optimistic-${Date.now()}`,
            text: reviewText,
            rating: reviewRating,
            reviewerId: user.uid,
            reviewerName: user.displayName || 'Anonymous',
            reviewerAvatar: user.photoURL || '',
            createdAt: new Date(),
        };

        setReviews(prevReviews => [newReview, ...prevReviews]);
        setReviewText('');
        setReviewRating(5);

        try {
            await addDoc(collection(db, 'Users', user.uid, 'Reviews'), {
                ...newReview,
                createdAt: serverTimestamp(),
            });
            fetchReviews();
        } catch (e) {
            console.error("Error posting review:", e);
            Alert.alert('Error', 'Failed to post review. Please try again.');
            setReviews(prevReviews => prevReviews.filter(r => r.id !== newReview.id));
        } finally {
            setPosting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>

            <View style={styles.addReviewContainer}>
                <TextInput
                    style={styles.reviewInput}
                    placeholder="Leave a review..."
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                />
                <StarRating rating={reviewRating} onRate={setReviewRating} />
                <TouchableOpacity style={styles.postButton} onPress={handlePostReview} disabled={posting}>
                    <Text style={styles.postButtonText}>{posting ? 'Posting...' : 'Post Review'}</Text>
                </TouchableOpacity>
            </View>

            {loading ? <ReviewsSkeleton /> : (
                <FlatList
                    data={reviews}
                    renderItem={({ item }) => <ReviewItem review={item} />}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet. Be the first!</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSize.h3,
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    addReviewContainer: {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        ...shadow.light,
    },
    reviewInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: spacing.md,
    },
    postButton: {
        backgroundColor: '#667eea',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSize.lg,
    },
    reviewItem: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: spacing.md,
    },
    reviewContent: {
        flex: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    reviewerName: {
        fontWeight: 'bold',
    },
    reviewTimestamp: {
        color: '#999',
        fontSize: fontSize.sm,
    },
    reviewText: {
        marginTop: spacing.sm,
        color: '#333',
    },
    skeletonElement: {
        backgroundColor: '#e3e6f3',
        borderRadius: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: spacing.xl,
    }
}); 