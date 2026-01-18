import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import FormInput from '../../components/Common/FormInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

const eventSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    date: yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
    location: yup.string().required('Location is required'),
});

const AdminEventForm = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            date: new Date(),
            location: '',
        }
    });

    const selectedDate = watch('date');

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');
        setValue('date', currentDate, { shouldValidate: true });
        if (Platform.OS !== 'ios') {
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newDate = new Date(selectedDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setValue('date', newDate, { shouldValidate: true });
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await addDoc(collection(db, 'events'), {
                title: data.title,
                description: data.description,
                date: Timestamp.fromDate(data.date),
                time: data.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                location: data.location,
                attendees: [],
            });
            Alert.alert(t('success'), t('eventCreatedSuccess'));
            router.back();
        } catch (error) {
            Alert.alert(t('error'), t('errorCreatingEvent'));
            console.error('Error creating event:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('createEvent')}</Text>

            <FormInput name="title" control={control} placeholder={t('title')} error={errors.title} />
            <FormInput name="description" control={control} placeholder={t('description')} error={errors.description} multiline />
            <FormInput name="location" control={control} placeholder={t('location')} error={errors.location} />

            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonText}>{t('selectDate')}</Text>
                </TouchableOpacity>
                <Text style={styles.dateText}>{selectedDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text>
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={selectedDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            {loading ? (
                <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
            ) : (
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.submitButtonText}>{t('createEvent')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    datePickerButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    datePickerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dateText: {
        marginLeft: 15,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 2,
    },
});

export default AdminEventForm; 