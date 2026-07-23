import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TaskEmptyState() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="calendar-blank"
        size={48}
        color="rgba(198,198,203,0.3)"
      />
      <Text style={styles.title}>No Tasks Scheduled</Text>
      <Text style={styles.subtitle}>
        Create a focus block in the Calendar tab to set tasks for this day.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.10)",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(198,198,203,0.8)",
    marginTop: 16,
    textAlign: "center",
    fontFamily: "Inter",
  },
  subtitle: {
    fontSize: 11,
    color: "rgba(198,198,203,0.5)",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Geist",
    lineHeight: 18,
    maxWidth: 240,
  },
});
