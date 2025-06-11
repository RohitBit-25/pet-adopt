import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    SCREEN_WIDTH,
    responsivePadding,
    verticalScale
} from '../../utils/responsive';

export default function Slider() {
    const [sliderList, setSliderList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Default slides if no data from Firebase
    const defaultSlides = [
        {
            id: 1,
            imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
            title: 'Find Your Perfect Pet',
            subtitle: 'Discover amazing pets waiting for a loving home'
        },
        {
            id: 2,
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
            title: 'Connect with Owners',
            subtitle: 'Chat directly with pet owners and arrange meetings'
        },
        {
            id: 3,
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
            title: 'Make a Difference',
            subtitle: 'Help pets find their forever homes'
        }
    ];

    useEffect(() => {
        GetSliders();

        // Auto-scroll functionality
        const interval = setInterval(() => {
            const totalSlides = sliderList.length || defaultSlides.length;
            if (totalSlides > 1) {
                if (currentIndex < totalSlides - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    setCurrentIndex(0);
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex, sliderList.length]);

    useEffect(() => {
        if (flatListRef.current && (sliderList.length > 0 || defaultSlides.length > 0)) {
            try {
                flatListRef.current.scrollToIndex({
                    index: currentIndex,
                    animated: true,
                });
            } catch (error) {
                // Handle scroll to index error gracefully
                console.log('Scroll to index error:', error);
            }
        }
    }, [currentIndex]);

    const GetSliders = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Sliders"));
            if (querySnapshot.size > 0) {
                const sliders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSliderList(sliders);
            } else {
                setSliderList(defaultSlides);
            }
        } catch (error) {
            console.error("Error fetching sliders: ", error);
            setSliderList(defaultSlides);
        }
    };

    const renderSlideItem = ({ item, index }) => (
        <View style={styles.slideContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item?.imageUrl }} style={styles.sliderImage} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                />
                <View style={styles.slideContent}>
                    <Text style={styles.slideTitle}>{item?.title || 'Pet Adoption'}</Text>
                    <Text style={styles.slideSubtitle}>{item?.subtitle || 'Find your perfect companion'}</Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/add-new-pet')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.exploreButtonText}>Explore</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const displayData = sliderList.length > 0 ? sliderList : defaultSlides;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={displayData}
                keyExtractor={(item, index) => `${item.id || index}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={renderSlideItem}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {displayData.map((_, index) => {
                    const inputRange = [
                        (index - 1) * SCREEN_WIDTH,
                        index * SCREEN_WIDTH,
                        (index + 1) * SCREEN_WIDTH,
                    ];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    width: dotWidth,
                                    opacity,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    slideContainer: {
        width: SCREEN_WIDTH,
        paddingHorizontal: spacing.md,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadow.large,
    },
    sliderImage: {
        width: SCREEN_WIDTH - (spacing.md * 2),
        height: deviceInfo.isTablet ? verticalScale(250) : verticalScale(200),
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    slideContent: {
        position: 'absolute',
        bottom: spacing.lg,
        left: spacing.lg,
        right: spacing.lg,
    },
    slideTitle: {
        fontSize: deviceInfo.isTablet ? fontSize.hero : fontSize.title,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: spacing.sm,
    },
    slideSubtitle: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Pacifico-Regular',
        marginBottom: spacing.lg,
        lineHeight: deviceInfo.isTablet ? 28 : 22,
    },
    exploreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(102, 126, 234, 0.9)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        alignSelf: 'flex-start',
    },
    exploreButtonText: {
        color: 'white',
        fontSize: fontSize.md,
        fontWeight: '600',
        marginRight: spacing.xs,
        fontFamily: 'PermanentMarker-Regular',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
    paginationDot: {
        height: spacing.sm,
        borderRadius: spacing.xs,
        backgroundColor: '#667eea',
    },
});
