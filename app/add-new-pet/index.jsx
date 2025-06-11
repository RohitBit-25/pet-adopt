import {
    View, Text, TextInput, StyleSheet, Image, ScrollView,
    TouchableOpacity, Pressable, ToastAndroid, ActivityIndicator,
    Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components,
    SCREEN_WIDTH
} from '../../utils/responsive';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlnxkger6/image/upload";
const UPLOAD_PRESET = "pet_adopt";

export default function AddNewPet() {
    const navigation = useNavigation();
    const { user } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        Category: 'Dogs',
        breed: '',
        age: '',
        sex: 'Male',
        weight: '',
        address: '',
        about: ''
    });

    const [categoryList, setCategoryList] = useState([]);
    const [image, setImage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'Add New Pet' });
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Category"));
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name
            }));
            setCategoryList(categories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
            ToastAndroid.show("Failed to fetch categories", ToastAndroid.SHORT);
        }
    };

    const imagePicker = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert("Permission Required", "Permission to access camera roll is required!");
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                setImage(result.assets[0].uri);
                setErrors(prev => ({ ...prev, image: null }));
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image. Please try again.");
        }
    };

    const uploadImageToCloudinary = async () => {
        if (!image) return null;
        setLoader(true);

        const data = new FormData();
        data.append("file", {
            uri: image,
            type: "image/jpeg",
            name: "upload.jpg"
        });
        data.append("upload_preset", UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_URL, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setLoader(false);
            return response.data.secure_url;
        } catch (error) {
            console.error("Upload to Cloudinary failed:", error.response?.data || error.message);
            setLoader(false);
            return null;
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
        // Clear error when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Pet name is required';
        if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
        if (!formData.age.trim()) newErrors.age = 'Age is required';
        if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!image) newErrors.image = 'Pet image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if (!validateForm()) {
            ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User information not available. Please login again.');
            return;
        }

        setLoader(true);

        try {
            const imageUrl = await uploadImageToCloudinary();
            if (!imageUrl) {
                ToastAndroid.show('Image upload failed', ToastAndroid.SHORT);
                setLoader(false);
                return;
            }

            // Add pet with owner information
            await addDoc(collection(db, "Pets"), {
                ...formData,
                imageUrl: imageUrl,
                email: user.primaryEmailAddress.emailAddress,
                username: user.fullName || 'Anonymous User',
                userImage: user.imageUrl || 'https://via.placeholder.com/150',
                createdAt: new Date().toISOString(),
                id: Date.now().toString() // Temporary ID for immediate use
            });

            ToastAndroid.show('Pet added successfully!', ToastAndroid.LONG);

            // Reset form
            setFormData({
                name: '',
                Category: 'Dogs',
                breed: '',
                age: '',
                sex: 'Male',
                weight: '',
                address: '',
                about: ''
            });
            setImage(null);
            setErrors({});

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error("Error adding pet: ", error);
            Alert.alert('Error', 'Failed to add pet. Please try again.');
        } finally {
            setLoader(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.headerGradient}
                >
                    <Text style={styles.title}>Add New Pet</Text>
                    <Text style={styles.subtitle}>Find your furry friend a loving home</Text>
                </LinearGradient>

                <View style={styles.formContainer}>
                    {/* Image Picker Section */}
                    <View style={styles.imageSection}>
                        <Text style={styles.sectionTitle}>Pet Photo</Text>
                        <Pressable onPress={imagePicker} style={styles.imagePickerContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.selectedImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="camera" size={40} color="#667eea" />
                                    <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                                </View>
                            )}
                            <View style={styles.imageOverlay}>
                                <Ionicons name="camera" size={20} color="white" />
                            </View>
                        </Pressable>
                        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                    </View>

                    {/* Pet Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            <MaterialIcons name="pets" size={16} color="#667eea" /> Pet Name *
                        </Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            value={formData.name}
                            onChangeText={(value) => handleInputChange('name', value)}
                            placeholder="Enter your pet's name"
                            placeholderTextColor="#999"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    {/* Pet Category */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            <MaterialIcons name="category" size={16} color="#667eea" /> Pet Category *
                        </Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.Category}
                                style={styles.picker}
                                onValueChange={(itemValue) => handleInputChange('Category', itemValue)}>
                                {categoryList.map((category) => (
                                    <Picker.Item key={category.id} label={category.name} value={category.name} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Breed */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            <MaterialIcons name="pets" size={16} color="#667eea" /> Breed Name *
                        </Text>
                        <TextInput
                            style={[styles.input, errors.breed && styles.inputError]}
                            value={formData.breed}
                            onChangeText={(value) => handleInputChange('breed', value)}
                            placeholder="Enter breed (e.g., Golden Retriever)"
                            placeholderTextColor="#999"
                        />
                        {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}
                    </View>

                    {/* Age and Gender Row */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={styles.label}>
                                <MaterialIcons name="cake" size={16} color="#667eea" /> Age *
                            </Text>
                            <TextInput
                                style={[styles.input, errors.age && styles.inputError]}
                                value={formData.age}
                                keyboardType="numeric"
                                onChangeText={(value) => handleInputChange('age', value)}
                                placeholder="Years"
                                placeholderTextColor="#999"
                            />
                            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
                        </View>

                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={styles.label}>
                                <MaterialIcons name="wc" size={16} color="#667eea" /> Gender *
                            </Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.sex}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => handleInputChange('sex', itemValue)}>
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Weight and Address Row */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={styles.label}>
                                <MaterialIcons name="monitor-weight" size={16} color="#667eea" /> Weight *
                            </Text>
                            <TextInput
                                style={[styles.input, errors.weight && styles.inputError]}
                                value={formData.weight}
                                keyboardType="numeric"
                                onChangeText={(value) => handleInputChange('weight', value)}
                                placeholder="Kg"
                                placeholderTextColor="#999"
                            />
                            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                        </View>

                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={styles.label}>
                                <MaterialIcons name="location-on" size={16} color="#667eea" /> Address *
                            </Text>
                            <TextInput
                                style={[styles.input, errors.address && styles.inputError]}
                                value={formData.address}
                                onChangeText={(value) => handleInputChange('address', value)}
                                placeholder="City, State"
                                placeholderTextColor="#999"
                            />
                            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                        </View>
                    </View>

                    {/* About */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            <MaterialIcons name="description" size={16} color="#667eea" /> About Your Pet
                        </Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.about}
                            multiline
                            numberOfLines={4}
                            onChangeText={(value) => handleInputChange('about', value)}
                            placeholder="Tell us about your pet's personality, habits, and special needs..."
                            placeholderTextColor="#999"
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loader && styles.submitButtonDisabled]}
                        onPress={onSubmit}
                        disabled={loader}
                    >
                        <LinearGradient
                            colors={loader ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
                            style={styles.submitButtonGradient}
                        >
                            {loader ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text style={styles.submitButtonText}>Adding Pet...</Text>
                                </View>
                            ) : (
                                <View style={styles.submitButtonContent}>
                                    <MaterialIcons name="add" size={20} color="white" />
                                    <Text style={styles.submitButtonText}>Add Pet</Text>
                                </View>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: spacing.xxl,
    },
    headerGradient: {
        paddingTop: deviceInfo.statusBarHeight + spacing.lg,
        paddingBottom: spacing.xl,
        paddingHorizontal: responsivePadding.horizontal,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
    },
    title: {
        fontSize: deviceInfo.isTablet ? fontSize.hero : fontSize.heading,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'PermanentMarker-Regular',
    },
    subtitle: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: spacing.sm,
        fontFamily: 'Pacifico-Regular',
    },
    formContainer: {
        padding: responsivePadding.large,
        marginTop: -spacing.lg,
        backgroundColor: 'white',
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadow.medium,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        fontWeight: '600',
        color: '#333',
        marginBottom: spacing.lg,
        fontFamily: 'PermanentMarker-Regular',
    },
    imagePickerContainer: {
        position: 'relative',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    selectedImage: {
        width: components.image.xlarge,
        height: components.image.xlarge,
        borderRadius: borderRadius.lg,
    },
    imagePlaceholder: {
        width: components.image.xlarge,
        height: components.image.xlarge,
        backgroundColor: '#f0f0f0',
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#667eea',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: '#667eea',
        fontSize: 14,
        fontWeight: '500',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderRadius: 15,
        padding: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    halfWidth: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'PermanentMarker-Regular',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e1e5e9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    inputError: {
        borderColor: '#ff6b6b',
        borderWidth: 2,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e1e5e9',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    picker: {
        height: 50,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    submitButton: {
        marginTop: 30,
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'PermanentMarker-Regular',
    },
});
