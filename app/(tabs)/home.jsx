import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PetListCategory from '../../components/Home/PetListCategory'
import SearchBar from '../../components/Home/SearchBar'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components
} from '../../utils/responsive';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
        console.log('Searching for:', query);
    };

    const handleFilter = () => {
        console.log('Filter pressed');
    };

    // Create data array for FlatList with different component types
    const homeData = [
        { id: 'header', type: 'header' },
        { id: 'search', type: 'search' },
        { id: 'slider', type: 'slider' },
        { id: 'petList', type: 'petList' },
        { id: 'addPet', type: 'addPet' },
        { id: 'spacer', type: 'spacer' },
    ];

    const renderHomeItem = ({ item }) => {
        switch (item.type) {
            case 'header':
                return <Header />;

            case 'search':
                return (
                    <View style={styles.sectionContainer}>
                        <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
                    </View>
                );

            case 'slider':
                return (
                    <View style={styles.sectionContainer}>
                        <Slider />
                    </View>
                );

            case 'petList':
                return (
                    <View style={styles.sectionContainer}>
                        <PetListCategory searchQuery={searchQuery} />
                    </View>
                );

            case 'addPet':
                return (
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            style={styles.addNewPetContainer}
                            onPress={() => router.push('/add-new-pet')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.addNewPetGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <View style={styles.addNewPetContent}>
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="pets" size={28} color="white" />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.addNewPetTitle}>Add New Pet</Text>
                                        <Text style={styles.addNewPetSubtitle}>Help a pet find a home</Text>
                                    </View>
                                    <MaterialIcons name="arrow-forward" size={24} color="white" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                );

            case 'spacer':
                return <View style={{ height: spacing.xxl * 2 }} />;

            default:
                return null;
        }
    };

    return (
        <FlatList
            style={styles.container}
            data={homeData}
            renderItem={renderHomeItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        paddingTop: deviceInfo.statusBarHeight + spacing.lg,
        paddingBottom: spacing.xxl,
    },
    sectionContainer: {
        paddingHorizontal: responsivePadding.horizontal,
    },
    addNewPetContainer: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadow.large,
        shadowColor: '#667eea',
    },
    addNewPetGradient: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    addNewPetContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: components.avatar.medium,
        height: components.avatar.medium,
        borderRadius: components.avatar.medium / 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    addNewPetTitle: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.title : fontSize.xl,
        color: 'white',
        fontWeight: 'bold',
    },
    addNewPetSubtitle: {
        fontFamily: 'Pacifico-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.lg : fontSize.md,
        color: 'rgba(255,255,255,0.9)',
        marginTop: spacing.xs / 2,
    },
})