import { View, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Slider() {
    const [sliderList, setSliderList] = useState([]);

    useEffect(() => {
        GetSliders();
    }, []);

    const GetSliders = async () => {
        setSliderList([]);
        try {
            const querySnapshot = await getDocs(collection(db, "Sliders"));
            const sliders = querySnapshot.docs.map(doc => doc.data()); // Collect data first
            setSliderList(sliders); // Update state once
        } catch (error) {
            console.error("Error fetching sliders: ", error);
        }
    };

    return (
        <View style={{ marginTop: 15 }}>
            <FlatList
                data={sliderList}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View>
                        <Image source={{ uri: item?.imageUrl }} style={styles.sliderImage} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sliderImage: {
        width: Dimensions.get('screen').width * 0.9,
        height: 180,
        borderRadius: 10,
        marginLeft: 15

    }
});
