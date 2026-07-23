/*auth redirect logic */
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./(auth)/sign-in";
import { Stack } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#051424" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SignIn />
    </SafeAreaView>
  );
}
