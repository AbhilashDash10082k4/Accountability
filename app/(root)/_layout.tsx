import { Redirect, Slot } from "expo-router";
import { useAuthContext } from "@/hooks/use-auth-context";
import GoogleAuthCallback from "../google-auth";

export default function RootLayout() {
  const { isLoggedIn, isLoading } = useAuthContext();

  //   useUserSync();

  if (isLoading) return <GoogleAuthCallback />;
  if (!isLoggedIn) return <Redirect href="/sign-in" />;

  return <Slot />;
}
