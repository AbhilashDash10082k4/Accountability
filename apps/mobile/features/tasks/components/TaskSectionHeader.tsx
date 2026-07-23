import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TaskSectionHeaderProps {
  icon: string;
  iconColor: string;
  label: string;
  count: number;
}

export default function TaskSectionHeader({
  icon,
  iconColor,
  label,
  count,
}: TaskSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={icon as any}
        size={18}
        color={iconColor}
      />
      <Text style={[styles.label, { color: iconColor }]}>
        {label} ({count})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Geist",
  },
});
