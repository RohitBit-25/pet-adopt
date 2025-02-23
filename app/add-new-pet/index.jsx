import {
    View, Text, TextInput, StyleSheet, Image, ScrollView,
    TouchableOpacity, Pressable, ToastAndroid, ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlnxkger6/image/upload";
const UPLOAD_PRESET = "pet_adopt";

export default function AddNewPet() {
    const navigation = useNavigation();
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
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        } else {
            console.warn("Image selection was canceled or no valid image found.");
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
    };

    const onSubmit = async () => {
        if (!formData.name || !formData.Category || !formData.breed || !formData.age || !formData.sex || !formData.weight || !formData.address) {
            ToastAndroid.show('Enter All Details', ToastAndroid.SHORT);
            return;
        }

        const imageUrl = await uploadImageToCloudinary();
        if (!imageUrl) {
            ToastAndroid.show('Image upload failed', ToastAndroid.SHORT);
            return;
        }

        try {
            await addDoc(collection(db, "Pets"), {
                ...formData,
                imageUrl: imageUrl
            });

            ToastAndroid.show('Pet added successfully!', ToastAndroid.SHORT);

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error("Error adding pet: ", error);
            ToastAndroid.show('Error adding pet', ToastAndroid.SHORT);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add New Pet</Text>

            <Pressable onPress={imagePicker}>
                <Image
                    source={image ? { uri: image } : require("./../../assets/images/placeholder.png")}
                    style={styles.image}
                />
            </Pressable>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput style={styles.input} onChangeText={(value) => handleInputChange('name', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Category *</Text>
                <Picker
                    selectedValue={formData.Category}
                    style={styles.input}
                    onValueChange={(itemValue) => handleInputChange('Category', itemValue)}>
                    {categoryList.map((category) => (
                        <Picker.Item key={category.id} label={category.name} value={category.name} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed Name *</Text>
                <TextInput style={styles.input} onChangeText={(value) => handleInputChange('breed', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Age *</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleInputChange('age', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender *</Text>
                <Picker
                    selectedValue={formData.sex}
                    style={styles.input}
                    onValueChange={(itemValue) => handleInputChange('sex', itemValue)}>
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight *</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleInputChange('weight', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address *</Text>
                <TextInput style={styles.input} onChangeText={(value) => handleInputChange('address', value)} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>About</Text>
                <TextInput style={styles.input} multiline numberOfLines={5} onChangeText={(value) => handleInputChange('about', value)} />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={onSubmit}
                disabled={loader}
            >
                {loader ? <ActivityIndicator size={'large'} /> : <Text style={styles.buttonText}>Submit</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 25, fontWeight: 'bold' },
    image: { width: 100, height: 100, borderRadius: 15, borderWidth: 1, borderColor: 'gray' },
    inputContainer: { marginVertical: 5 },
    input: { padding: 15, backgroundColor: '#fff8dc', borderRadius: 8 },
    label: { marginVertical: 5, fontWeight: 'bold' },
    button: { padding: 15, backgroundColor: '#7fffd4', borderRadius: 15, marginVertical: 10 },
    buttonText: { textAlign: 'center', fontWeight: 'bold' },
});
