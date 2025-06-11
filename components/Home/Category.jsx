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

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');

    // Default categories with enhanced data
    const defaultCategories = [
        {
            id: 1,
            name: 'Dogs',
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
            icon: 'pets',
            color: '#667eea'
        },
        {
            id: 2,
            name: 'Cats',
            imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
            icon: 'pets',
            color: '#764ba2'
        },
        {
            id: 3,
            name: 'Birds',
            imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200',
            icon: 'flutter-dash',
            color: '#ff6b6b'
        },
        {
            id: 4,
            name: 'Fish',
            imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
            icon: 'water',
            color: '#4ecdc4'
        },
    ];

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        try {
            const snapshots = await getDocs(collection(db, "Category"));
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



    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Categories</Text>
                <Text style={styles.subtitle}>Choose your favorite pet type</Text>
            </View>

            <View style={styles.categoriesGrid}>
                {displayData.map((item, index) => {
                    const isSelected = selectedCategory === item.name;

                    return (
                        <TouchableOpacity
                            key={item.id || index}
                            onPress={() => {
                                setSelectedCategory(item.name);
                                category(item.name);
                            }}
                            style={styles.categoryItemContainer}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.categoryCard,
                                isSelected && styles.selectedCategoryCard
                            ]}>
                                {isSelected && (
                                    <LinearGradient
                                        colors={[item.color || '#667eea', `${item.color || '#667eea'}80`]}
                                        style={styles.selectedGradient}
                                    />
                                )}

                                <View style={[
                                    styles.imageContainer,
                                    isSelected && styles.selectedImageContainer
                                ]}>
                                    <Image
                                        source={{ uri: item?.imageUrl }}
                                        style={styles.categoryImage}
                                    />
                                    {isSelected && (
                                        <View style={styles.selectedOverlay}>
                                            <MaterialIcons name="check-circle" size={20} color="white" />
                                        </View>
                                    )}
                                </View>

                                <Text style={[
                                    styles.categoryName,
                                    isSelected && styles.selectedCategoryName
                                ]}>
                                    {item?.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
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
    headerContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.title : fontSize.xl,
        color: '#333',
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontFamily: 'Pacifico-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.lg : fontSize.md,
        color: '#666',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xs,
    },
    categoryItemContainer: {
        width: deviceInfo.isTablet ? '22%' : '23%',
        margin: spacing.xs,
        marginBottom: spacing.md,
    },
    categoryCard: {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: deviceInfo.isTablet ? spacing.lg : spacing.md,
        alignItems: 'center',
        ...shadow.small,
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        minHeight: deviceInfo.isTablet ? 100 : 80,
    },
    selectedCategoryCard: {
        borderColor: '#667eea',
        transform: [{ scale: deviceInfo.isTablet ? 1.03 : 1.05 }],
        ...shadow.medium,
    },
    selectedGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: spacing.sm,
    },
    selectedImageContainer: {
        transform: [{ scale: 1.1 }],
    },
    categoryImage: {
        width: deviceInfo.isTablet ? iconSize.xxl + 8 : iconSize.xl,
        height: deviceInfo.isTablet ? iconSize.xxl + 8 : iconSize.xl,
        borderRadius: (deviceInfo.isTablet ? iconSize.xxl + 8 : iconSize.xl) / 2,
    },
    selectedOverlay: {
        position: 'absolute',
        top: -spacing.xs,
        right: -spacing.xs,
        backgroundColor: '#667eea',
        borderRadius: spacing.md,
        width: spacing.lg,
        height: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryName: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
        color: '#333',
        textAlign: 'center',
        lineHeight: deviceInfo.isTablet ? 18 : 16,
    },
    selectedCategoryName: {
        color: '#667eea',
        fontWeight: 'bold',
    },
});
