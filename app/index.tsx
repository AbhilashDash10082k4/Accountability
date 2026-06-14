/*auth redirect logic */
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./(auth)/sign-in";
import { Stack } from "expo-router";

export default function index() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <SignIn />
    </SafeAreaView>
  );
}
