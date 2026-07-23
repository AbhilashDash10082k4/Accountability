import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const PROOF_TYPES = ["text", "url", "image", "video"] as const;
type ProofType = (typeof PROOF_TYPES)[number];

interface ProofTypeSelectorProps {
  activeType: ProofType;
  onSelect: (type: ProofType) => void;
}

export default function ProofTypeSelector({
  activeType,
  onSelect,
}: ProofTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {PROOF_TYPES.map((type) => {
        const active = activeType === type;
        return (
          <Pressable
            key={type}
            onPress={() => onSelect(type)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, active && styles.activeTabText]}
            >
              {type.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#e0a96d",
  },
  tabText: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(198,198,203,0.7)",
  },
  activeTabText: {
    color: "#051424",
  },
});
