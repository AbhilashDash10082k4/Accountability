/*auth redirect logic */
import { Redirect, Stack } from "expo-router";
import { useAuthContext } from "@/hooks/use-auth-context";
import GoogleAuthCallback from "./google-auth";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuthContext();

  if (isLoading) return <GoogleAuthCallback />;

  if (!isLoggedIn) return <Redirect href="/sign-in" />;

  return <Redirect href="/(tabs)" />;
  // return (
  //   <SafeAreaView style={{ flex: 1, backgroundColor: "#051424" }}>
  //     <Stack.Screen options={{ headerShown: false }} />
  //     <SignIn />
  //   </SafeAreaView>
  // );
}
