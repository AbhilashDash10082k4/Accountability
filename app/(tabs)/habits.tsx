import React from "react";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#051424" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#d4e4fa", fontSize: 18 }}>Habits</Text>
      </View>
    </SafeAreaView>
  );
}
