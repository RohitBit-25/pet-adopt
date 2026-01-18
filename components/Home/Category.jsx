<<<<<<< HEAD
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components,
    grid
} from '../../utils/responsive';
import { router } from 'expo-router';
import { withSafeComponent } from '../Common/SafeComponent';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');

    // Default categories with enhanced data
    const defaultCategories = [
        {
            id: 1,
            name: 'Dogs',
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
            icon: 'pets',
            color: '#667eea',
            count: 150
        },
        {
            id: 2,
            name: 'Cats',
            imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
            icon: 'pets',
            color: '#764ba2',
            count: 120
        },
        {
            id: 3,
            name: 'Birds',
            imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200',
            icon: 'flutter-dash',
            color: '#ff6b6b',
            count: 45
        },
        {
            id: 4,
            name: 'Fish',
            imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
            icon: 'water',
            color: '#4ecdc4',
            count: 30
        },
        {
            id: 5,
            name: 'Rabbits',
            imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200',
            icon: 'pets',
            color: '#ffa500',
            count: 25
        },
        {
            id: 6,
            name: 'Others',
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200',
            icon: 'more-horiz',
            color: '#ff0000',
            count: 35
        }
    ];

=======
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');

>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        try {
            const snapshots = await getDocs(collection(db, "Category"));
<<<<<<< HEAD
            if (snapshots.size > 0) {
                const categories = snapshots.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategoryList(categories);
            } else {
                setCategoryList(defaultCategories);
            }
        } catch (error) {
            console.error("Error fetching categories: ", error);
            setCategoryList(defaultCategories);
        }
    };

    const displayData = categoryList.length > 0 ? categoryList : defaultCategories;

    const handleCategoryPress = (category) => {
        // Navigate to filtered pet list
        router.push({
            pathname: '/(tabs)/home',
            params: { category: category.name.toLowerCase() }
        });
    };

    const renderCategoryItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.categoryItem}
            onPress={() => {
                setSelectedCategory(item.name);
                handleCategoryPress(item);
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} category with ${item.count} pets`}
        >
            <View style={styles.categoryContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item?.imageUrl }}
                        style={styles.categoryImage}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.imageOverlay}
                    />
                    <View style={styles.iconContainer}>
                        <MaterialIcons name={item?.icon} size={24} color={colors.textLight} />
                    </View>
                </View>
                <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{item?.name}</Text>
                    <Text style={styles.categoryCount}>{item?.count} pets</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pet Categories</Text>
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push('/(tabs)/home')}
                    accessibilityRole="button"
                    accessibilityLabel="View all categories"
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.categoriesGrid}>
                {displayData.map(renderCategoryItem)}
            </View>
        </View>
=======
            const categories = snapshots.docs.map(doc => doc.data()); // Collect data first
            setCategoryList(categories); // Update state once
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    return (
        <View style={{
            marginTop: 15,

        }}>
            <Text style={styles.title}>Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (


                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item.name);
                            category(item.name);
                        }}
                        style={{
                            flex: 1
                        }}>


                        <View style={[styles.container,
                        selectedCategory == item.name && styles.selectedCategory
                        ]}>
                            <Image source={{ uri: item?.imageUrl }} style={styles.image} />
                        </View>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: 'PermanentMarker-Regular',
                            fontSize: 15
                        }}>
                            {item?.name}
                        </Text>
                    </TouchableOpacity>
                )

                }
            />
        </View >
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
    );
}

const styles = StyleSheet.create({
    container: {
<<<<<<< HEAD
        marginBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: responsivePadding.horizontal,
    },
    title: {
        fontSize: typography.fontSize.h3,
        color: colors.text,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    viewAllText: {
        fontSize: typography.fontSize.body,
        color: colors.primary,
        fontFamily: typography.fontFamily.accent,
        fontWeight: typography.fontWeight.bold,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: responsivePadding.horizontal,
        gap: spacing.md,
    },
    categoryItem: {
        width: deviceInfo.isTablet ? '30%' : '48%',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadow.medium,
        backgroundColor: colors.surface,
    },
    categoryContent: {
        position: 'relative',
    },
    imageContainer: {
        position: 'relative',
        height: deviceInfo.isTablet ? 120 : 100,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    iconContainer: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: borderRadius.sm,
        padding: spacing.xs,
    },
    categoryInfo: {
        padding: spacing.md,
    },
    categoryName: {
        fontSize: typography.fontSize.body,
        color: colors.text,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    categoryCount: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.regular,
    },
});

export default withSafeComponent(Category);
=======
        backgroundColor: '#fff1c9',
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#fff1c9',
        margin: 5

    },
    title: {
        fontFamily: "Pacifico",
        fontSize: 20,
        marginBottom: 10,
    },

    image: {
        width: 40,
        height: 40,

    },
    selectedCategory: {
        backgroundColor: '#f5d372',
        borderColor: '#f5d372',
    }
});
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
