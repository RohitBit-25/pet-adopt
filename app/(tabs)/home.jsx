import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { withSafeComponent } from '../../components/Common/SafeComponent';
import Header from '../../components/Home/Header';
import SearchBar from '../../components/Home/SearchBar';
import Slider from '../../components/Home/Slider';
import Category from '../../components/Home/Category';
import PetListCategory from '../../components/Home/PetListCategory';
import colors from '../../theme/colors';
import {
    spacing,
    deviceInfo
} from '../../utils/responsive';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshSignal, setRefreshSignal] = useState(0);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            // Refresh data when screen comes into focus
            handleRefresh();
        }, [])
    );

    const handleSearch = (query) => {
        // You can implement search logic here
        if (__DEV__) {
            console.log('Search query:', query);
        }
    };

    const handleFilter = () => {
        // You can implement filter logic here
        if (__DEV__) {
            console.log('Filter pressed');
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            setRefreshSignal((prev) => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            if (__DEV__) {
                console.error('Refresh error:', error);
            }
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Header Section */}
                <Header />

                {/* Search Section */}
                <SearchBar
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />

                {/* Slider Section */}
                <Slider />

                {/* Categories Section */}
                <Category />

                {/* Featured Pets Section */}
                <PetListCategory
                    title="Featured Pets"
                    subtitle="Hand-picked pets for you"
                    category="all"
                    showViewAll={true}
                    refreshSignal={refreshSignal}
                />

                {/* Dogs Section */}
                <PetListCategory
                    title="Dogs"
                    subtitle="Loyal companions waiting for you"
                    category="dogs"
                    showViewAll={true}
                    refreshSignal={refreshSignal}
                />

                {/* Cats Section */}
                <PetListCategory
                    title="Cats"
                    subtitle="Independent and loving friends"
                    category="cats"
                    showViewAll={true}
                    refreshSignal={refreshSignal}
                />

                {/* Other Pets Section */}
                <PetListCategory
                    title="Other Pets"
                    subtitle="Unique pets looking for homes"
                    category="others"
                    showViewAll={true}
                    refreshSignal={refreshSignal}
                />

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/add-new-pet')}
                accessibilityRole="button"
                accessibilityLabel="Add New Pet"
            >
                <Ionicons name="add-circle" size={64} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingTop: deviceInfo.isTablet ? spacing.xl : spacing.lg,
        paddingBottom: spacing.xl,
    },
    bottomSpacing: {
        height: spacing.xl,
    },
    fab: {
        position: 'absolute',
        right: spacing.xl,
        bottom: spacing.xl,
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 4,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});

export default withSafeComponent(HomeScreen);