<<<<<<< HEAD
import { View, ActivityIndicator, Text } from "react-native";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import ErrorBoundary from "../components/ErrorBoundary";

function Index() {
  useAuthNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#667eea' }}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{ color: 'white', marginTop: 10, fontSize: 16, textAlign: 'center' }}>
        Loading PetAdopt...
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Index />
    </ErrorBoundary>
  );
}
=======
import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {

  const { user } = useUser();
  return (
    <View
      style={{
        flex: 1,

      }}
    >
      {
        user ?
          <Redirect href={'/(tabs)/home'} />
          : <Redirect href={'/login'} />}

    </View>
  );
}
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
