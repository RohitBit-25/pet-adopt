import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
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
                    <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for pets..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={handleSearch}
                        returnKeyType="search"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <MaterialIcons name="close" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.filterButtonGradient}
                    >
                        <MaterialIcons name="tune" size={24} color="white" />
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
                    >
                        <MaterialIcons name="location-on" size={16} color="#667eea" />
                        <Text style={styles.quickFilterText}>Nearby</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickFilterChip}
                        onPress={() => handleQuickFilter('popular')}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="favorite" size={16} color="#ff6b6b" />
                        <Text style={styles.quickFilterText}>Popular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickFilterChip}
                        onPress={() => handleQuickFilter('recent')}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="schedule" size={16} color="#4ecdc4" />
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
        backgroundColor: 'white',
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: deviceInfo.isTablet ? spacing.lg : spacing.md,
        ...shadow.medium,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        minHeight: components.input.height,
    },
    searchIcon: {
        marginRight: spacing.md,
    },
    searchInput: {
        flex: 1,
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: '#333',
        fontFamily: 'Pacifico-Regular',
    },
    clearButton: {
        padding: spacing.xs,
    },
    filterButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadow.medium,
        shadowColor: '#667eea',
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
        fontSize: deviceInfo.isTablet ? fontSize.lg : fontSize.md,
        color: '#666',
        fontFamily: 'PermanentMarker-Regular',
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
        backgroundColor: 'white',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
        ...shadow.small,
        minHeight: deviceInfo.isTablet ? 40 : 32,
    },
    quickFilterText: {
        fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
        color: '#666',
        fontFamily: 'PermanentMarker-Regular',
    },
});
