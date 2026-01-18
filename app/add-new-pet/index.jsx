import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, Pressable, ToastAndroid, ActivityIndicator,
    Alert, KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../../components/Common/FormInput';
import Environment from '../../config/Environment';
import ErrorBoundary from '../../components/ErrorBoundary';
import { spacing, fontSize, borderRadius, shadow, components } from '../../utils/responsive';

const petSchema = yup.object().shape({
    name: yup.string().required('Pet name is required'),
    Category: yup.string().required('Category is required'),
    breed: yup.string().required('Breed is required'),
    age: yup.number().typeError('Age must be a number').positive('Age must be positive').required('Age is required'),
    sex: yup.string().required('Sex is required'),
    weight: yup.number().typeError('Weight must be a number').positive('Weight must be positive').required('Weight is required'),
    address: yup.string().required('Address is required'),
    about: yup.string(),
    image: yup.string().required('Pet image is required'),
    activityLevel: yup.string().oneOf(['low', 'moderate', 'high']).required('Activity level is required'),
    isHypoallergenic: yup.boolean().required('Please specify if the pet is hypoallergenic'),
    isNeutered: yup.boolean().required('Please specify if the pet is neutered'),
});

export default function AddNewPet() {
    const navigation = useNavigation();
    const { user } = useFirebaseAuth();
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(petSchema),
        defaultValues: {
            name: '', Category: 'Dogs', breed: '', age: '',
            sex: 'Male', weight: '', address: '', about: '', image: null,
            activityLevel: 'moderate', isHypoallergenic: false, isNeutered: false,
        }
    });

    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const imageUri = watch('image');

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'Add New Pet', headerShown: false });
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, "Category"));
            setCategoryList(snapshot.docs.map(doc => doc.data()));
        } catch (error) {
            ToastAndroid.show("Failed to fetch categories", ToastAndroid.SHORT);
        }
    };

    const imagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8,
        });
        if (!result.canceled && result.assets.length > 0) {
            setValue('image', result.assets[0].uri, { shouldValidate: true });
        }
    };

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            // Create FormData for image upload
            const data = new global.FormData();
            data.append("file", {
                uri: formData.image,
                type: "image/jpeg",
                name: "upload.jpg"
            });
            data.append("upload_preset", Environment.CLOUDINARY.UPLOAD_PRESET);
            const response = await axios.post(Environment.CLOUDINARY.API_URL, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const imageUrl = response.data.secure_url;

            if (!imageUrl) throw new Error("Image upload failed");

            await addDoc(collection(db, "Pets"), {
                ...formData, imageUrl,
                email: user.email,
                username: user.displayName || 'Anonymous',
                userImage: user.photoURL || '',
                createdAt: new Date().toISOString(),
                approved: false,
                activityLevel: formData.activityLevel,
                isHypoallergenic: formData.isHypoallergenic,
                isNeutered: formData.isNeutered,
            });

            ToastAndroid.show('Pet added successfully!', ToastAndroid.LONG);
            if (navigation.canGoBack()) navigation.goBack();

        } catch (error) {
            Alert.alert('Error', 'Failed to add pet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ErrorBoundary>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.formContainer}>
                        <Pressable onPress={imagePicker} style={styles.imagePickerContainer}>
                            {imageUri ? <Image source={{ uri: imageUri }} style={styles.selectedImage} /> : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="camera" size={40} color="#667eea" />
                                    <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                                </View>
                            )}
                        </Pressable>
                        {errors.image && <Text style={styles.errorText}>{errors.image.message}</Text>}

                        <FormInput name="name" control={control} placeholder="Pet's Name" label="Name" icon="pets" />

                        <Text style={styles.label}>Category</Text>
                        <Controller name="Category" control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={value} onValueChange={onChange}>
                                        {categoryList.map((cat) => <Picker.Item key={cat.name} label={cat.name} value={cat.name} />)}
                                    </Picker>
                                </View>
                            )}
                        />
                        {errors.Category && <Text style={styles.errorText}>{errors.Category.message}</Text>}

                        <FormInput name="breed" control={control} placeholder="e.g., Golden Retriever" label="Breed" icon="pets" />
                        <FormInput name="age" control={control} placeholder="Years" label="Age" icon="cake" keyboardType="numeric" />

                        <Text style={styles.label}>Sex</Text>
                        <Controller name="sex" control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={value} onValueChange={onChange}>
                                        <Picker.Item label="Male" value="Male" />
                                        <Picker.Item label="Female" value="Female" />
                                    </Picker>
                                </View>
                            )}
                        />

                        <FormInput name="weight" control={control} placeholder="Kg" label="Weight" icon="monitor-weight" keyboardType="numeric" />
                        <FormInput name="address" control={control} placeholder="City, State" label="Address" icon="location-on" />
                        <FormInput name="about" control={control} placeholder="Tell us about your pet..." label="About" multiline numberOfLines={4} />

                        {/* Activity Level Picker */}
                        <Text style={styles.label}>Activity Level</Text>
                        <Controller name="activityLevel" control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={value} onValueChange={onChange}>
                                        <Picker.Item label="Low" value="low" />
                                        <Picker.Item label="Moderate" value="moderate" />
                                        <Picker.Item label="High" value="high" />
                                    </Picker>
                                </View>
                            )}
                        />
                        {errors.activityLevel && <Text style={styles.errorText}>{errors.activityLevel.message}</Text>}

                        {/* Hypoallergenic Switch */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md }}>
                            <Text style={styles.label}>Hypoallergenic</Text>
                            <Controller name="isHypoallergenic" control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Switch
                                        value={value}
                                        onValueChange={onChange}
                                        style={{ marginLeft: spacing.md }}
                                    />
                                )}
                            />
                        </View>
                        {errors.isHypoallergenic && <Text style={styles.errorText}>{errors.isHypoallergenic.message}</Text>}

                        {/* Neutered Switch */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md }}>
                            <Text style={styles.label}>Neutered/Spayed</Text>
                            <Controller name="isNeutered" control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Switch
                                        value={value}
                                        onValueChange={onChange}
                                        style={{ marginLeft: spacing.md }}
                                    />
                                )}
                            />
                        </View>
                        {errors.isNeutered && <Text style={styles.errorText}>{errors.isNeutered.message}</Text>}

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={loading}>
                            <LinearGradient colors={loading ? ['#ccc', '#999'] : ['#ff6b6b', '#667eea']} style={styles.submitButtonGradient}>
                                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Add Pet</Text>}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    formContainer: { padding: spacing.lg },
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
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'PermanentMarker-Regular',
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
    submitButton: {
        marginTop: spacing.xl,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    submitButtonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'PermanentMarker-Regular',
    },
});
