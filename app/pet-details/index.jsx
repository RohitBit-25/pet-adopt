import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import CommentsSection from '../../components/PetDetails/CommentsSection';
import AnimatedButton from '../../components/Common/AnimatedButton';
import { useAdoptionFlow } from '../../hooks/useAdoptionFlow';
import {
    fontSize,
    borderRadius,
    deviceInfo,
    responsivePadding,
    spacing,
    shadow
} from '../../utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import ConfettiOverlay from '../../components/Common/ConfettiOverlay';
import sharePet from '../../utils/shareUtils';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();
    const { isLoading, showConfetti, initiateChat } = useAdoptionFlow();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        });
    }, [navigation]);

    const handleShare = () => sharePet(pet);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <OwnerInfo pet={pet} />
                <CommentsSection petId={pet?.id} />
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Enhanced Adopt Button */}
            <View style={styles.bottomContainer}>
                <AnimatedButton
                    onPress={() => initiateChat(pet)}
                    loading={isLoading}
                    title="Adopt Me"
                    icon="favorite"
                    endIcon="arrow-forward"
                    style={{
                        borderRadius: borderRadius.xl,
                        shadowColor: '#ff6b6b',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.18,
                        shadowRadius: 12,
                        elevation: 8,
                    }}
                    textStyle={{
                        fontFamily: 'PermanentMarker-Regular',
                        fontSize: deviceInfo.isTablet ? fontSize.title : fontSize.xl,
                    }}
                />
            </View>

            {/* Share Button */}
            <View style={styles.shareButton}>
                <Pressable onPress={handleShare} style={{ borderRadius: 20, overflow: 'hidden' }}>
                    <LinearGradient colors={['#ff6b6b', '#667eea']} style={{ borderRadius: 20, padding: 8 }}>
                        <MaterialIcons name="share" size={22} color="white" />
                    </LinearGradient>
                </Pressable>
            </View>

            <ConfettiOverlay visible={showConfetti} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        paddingHorizontal: responsivePadding.horizontal,
        paddingVertical: spacing.lg,
        paddingBottom: deviceInfo.isTablet ? spacing.lg : spacing.lg + 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e1e5e9',
        ...shadow.large,
        shadowOffset: { width: 0, height: -2 },
    },
    shareButton: {
        position: 'absolute',
        top: 30,
        right: 30,
        zIndex: 10,
    },
});
