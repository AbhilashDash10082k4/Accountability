import { View, Text } from "react-native";
import React from "react";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Redirect, Stack } from "expo-router";
import GoogleAuthCallback from "../google-auth";

export default function AuthLayout() {
  const { isLoggedIn, isLoading } = useAuthContext();
  console.log("ROOT", { isLoading, isLoggedIn });

  if (isLoading) return <GoogleAuthCallback />;
  if (isLoggedIn) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
// // Separate RootNavigator so we can access the AuthContext
// function RootNavigator() {
//   // While auth state is resolving, render nothing (splash screen is still showing)

//   return (
//     <Stack>
//       <Stack.Protected guard={isLoggedIn}>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       </Stack.Protected>
//       <Stack.Protected guard={!isLoggedIn}>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//       </Stack.Protected>
//       <Stack.Screen name="+not-found" />
//     </Stack>
//   );
// }
