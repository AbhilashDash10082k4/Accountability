import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TaskDateHeaderProps {
  formattedDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSelectToday: () => void;
}

export default function TaskDateHeader({
  formattedDate,
  onPrevDay,
  onNextDay,
  onSelectToday,
}: TaskDateHeaderProps) {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
        backgroundColor: "#051424",
      }}
    >
      <Pressable
        onPress={onPrevDay}
        style={({ pressed }) => ({
          padding: 8,
          borderRadius: 999,
          backgroundColor: pressed ? "rgba(255,255,255,0.08)" : "transparent",
        })}
      >
        <Ionicons name="chevron-back" size={24} color="#d4e4fa" />
      </Pressable>

      <Pressable onPress={onSelectToday} style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: "#44e2cd",
            textTransform: "uppercase",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          Schedule Tasks
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#d4e4fa",
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {formattedDate}
        </Text>
      </Pressable>

      <Pressable
        onPress={onNextDay}
        style={({ pressed }) => ({
          padding: 8,
          borderRadius: 999,
          backgroundColor: pressed ? "rgba(255,255,255,0.08)" : "transparent",
        })}
      >
        <Ionicons name="chevron-forward" size={24} color="#d4e4fa" />
      </Pressable>
    </View>
  );
}
