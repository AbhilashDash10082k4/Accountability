import WelcomeScreen from "@/components/Welcome";
import { Stack } from "expo-router";

export default function index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WelcomeScreen />
    </>
  );
}
