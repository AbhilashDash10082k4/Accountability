/**protects all screens , checks authorized routes */
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/provider/auth-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthContext } from "@/hooks/use-auth-context";
import GoogleAuthCallback from "./google-auth";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
// // Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  // While auth state is resolving, render nothing (splash screen is still showing)
  const { isLoggedIn, isLoading } = useAuthContext();
  if (isLoading) return <GoogleAuthCallback />;
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="google-auth" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
