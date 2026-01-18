import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import {
    spacing,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components
} from '../../utils/responsive';

export default function SearchBar({ onSearch, onFilter }) {
    const [searchText, setSearchText] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const handleSearch = (text) => {
        setSearchText(text);
        onSearch(text);
    };

    const clearSearch = () => {
        setSearchText('');
        onSearch('');
    };

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
        if (onFilter) {
            onFilter();
        }
    };

    const handleQuickFilter = (filterType) => {
        let searchTerm = '';
        switch (filterType) {
            case 'nearby':
                searchTerm = 'near'; // You can implement location-based search
                break;
            case 'popular':
                searchTerm = 'popular'; // You can implement popularity-based search
                break;
            case 'recent':
                searchTerm = 'recent'; // You can implement recent pets search
                break;
            default:
                searchTerm = '';
        }
        setSearchText(searchTerm);
        onSearch(searchTerm);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <MaterialIcons name="search" size={24} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for pets..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchText}
                        onChangeText={handleSearch}
                        returnKeyType="search"
                        accessibilityLabel="Search pets"
                        accessibilityHint="Enter pet name, breed, or location"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            onPress={clearSearch}
                            style={styles.clearButton}
                            accessibilityRole="button"
                            accessibilityLabel="Clear search"
                        >
                            <MaterialIcons name="close" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleFilter}
                    accessibilityRole="button"
                    accessibilityLabel="Filter pets"
                >
                    <LinearGradient
                        colors={[colors.primary, colors.secondary]}
                        style={styles.filterButtonGradient}
                    >
                        <MaterialIcons name="tune" size={24} color={colors.textLight} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Quick Filters */}
            <View style={styles.quickFilters}>
                <Text style={styles.quickFiltersTitle}>Quick Filters:</Text>
                <View style={styles.quickFiltersContainer}>
                    <TouchableOpacity
                        style={styles.quickFilterChip}
                        onPress={() => handleQuickFilter('nearby')}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Filter by nearby pets"
                    >
                        <MaterialIcons name="location-on" size={16} color={colors.primary} />
                        <Text style={styles.quickFilterText}>Nearby</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickFilterChip}
                        onPress={() => handleQuickFilter('popular')}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Filter by popular pets"
                    >
                        <MaterialIcons name="favorite" size={16} color={colors.secondary} />
                        <Text style={styles.quickFilterText}>Popular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickFilterChip}
                        onPress={() => handleQuickFilter('recent')}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Filter by recent pets"
                    >
                        <MaterialIcons name="schedule" size={16} color={colors.info} />
                        <Text style={styles.quickFilterText}>Recent</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: deviceInfo.isTablet ? spacing.lg : spacing.md,
        ...shadow.medium,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: components.input.height,
    },
    searchIcon: {
        marginRight: spacing.md,
    },
    searchInput: {
        flex: 1,
        fontSize: deviceInfo.isTablet ? 18 : 16,
        color: colors.text,
        fontFamily: typography.fontFamily.accent,
    },
    clearButton: {
        padding: spacing.xs,
    },
    filterButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadow.medium,
        shadowColor: colors.primary,
    },
    filterButtonGradient: {
        width: components.button.height,
        height: components.button.height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickFilters: {
        marginTop: spacing.sm,
    },
    quickFiltersTitle: {
        fontSize: deviceInfo.isTablet ? 18 : 16,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.heading,
        marginBottom: spacing.sm,
    },
    quickFiltersContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    quickFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
        ...shadow.small,
        minHeight: deviceInfo.isTablet ? 40 : 32,
    },
    quickFilterText: {
        fontSize: deviceInfo.isTablet ? 16 : 14,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.heading,
    },
});
