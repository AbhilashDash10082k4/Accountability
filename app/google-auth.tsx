import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

export default function GoogleAuthCallback() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#051424",
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityIndicator size="large" color="#44e2cd" />
    </View>
  );
}
