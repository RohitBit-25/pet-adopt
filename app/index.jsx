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
