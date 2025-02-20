import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        try {
            const snapshots = await getDocs(collection(db, "Category"));
            const categories = snapshots.docs.map(doc => doc.data()); // Collect data first
            setCategoryList(categories); // Update state once
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    return (
        <View style={{
            marginTop: 15,

        }}>
            <Text style={styles.title}>Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (


                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item.name);
                            category(item.name);
                        }}
                        style={{
                            flex: 1
                        }}>


                        <View style={[styles.container,
                        selectedCategory == item.name && styles.selectedCategory
                        ]}>
                            <Image source={{ uri: item?.imageUrl }} style={styles.image} />
                        </View>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: 'PermanentMarker-Regular',
                            fontSize: 15
                        }}>
                            {item?.name}
                        </Text>
                    </TouchableOpacity>
                )

                }
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff1c9',
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#fff1c9',
        margin: 5

    },
    title: {
        fontFamily: "Pacifico",
        fontSize: 20,
        marginBottom: 10,
    },

    image: {
        width: 40,
        height: 40,

    },
    selectedCategory: {
        backgroundColor: '#f5d372',
        borderColor: '#f5d372',
    }
});
