import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import UserItem from '../../components/Inbox/UserItem';

export default function Inbox() {
    const { user } = useUser();
    const [userList, setUserList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (user) {
            console.log("User Email:", user?.primaryEmailAddress?.emailAddress);
            GetUserList();
        }
    }, [user]);

    const GetUserList = async () => {
        setLoader(true);
        try {
            const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            console.log("Querying Firestore with email:", userEmail);

            if (!userEmail) {
                console.warn("User email is undefined.");
                setLoader(false);
                return;
            }

            // Querying Firestore where userEmail exists in userIds array
            const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));
            const querySnapshot = await getDocs(q);
            console.log("Query Snapshot Size:", querySnapshot.size);

            const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserList(users);
        } catch (error) {
            console.error('Error fetching user list:', error);
        } finally {
            setLoader(false);
        }
    };

    const MapOtherUserList = () => {
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

        const mappedUsers = userList
            .map((record) => {
                if (!record.users || !Array.isArray(record.users)) {
                    console.warn("Invalid users array in record:", record);
                    return null;
                }

                // Find the other user details in the chat
                const otherUser = record.users.find(u => u.email.toLowerCase() !== currentUserEmail);
                if (!otherUser) {
                    console.warn("No other user found in chat record:", record);
                    return null;
                }

                return {
                    docId: record.id,
                    email: otherUser.email,
                    name: otherUser.name,
                    imageUrl: otherUser.imageUrl
                };
            })
            .filter(Boolean);

        console.log("Mapped Users List:", mappedUsers);
        return mappedUsers;
    };


    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'PermanentMarker-Regular', fontSize: 30 }}>Inbox</Text>
            {loader ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={MapOtherUserList()}
                    keyExtractor={(item) => item.docId}
                    refreshing={loader}
                    onRefresh={GetUserList}
                    style={{ marginTop: 20 }}
                    renderItem={({ item }) => <UserItem userInfo={item} />}
                />
            )}
        </View>
    );
}
