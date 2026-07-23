import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BlockConfirmationModalProps {
  visible: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function BlockConfirmationModal({ visible, count, onCancel, onConfirm }: BlockConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View style={{
          backgroundColor: "#0d1f33",
          borderRadius: 24,
          padding: 24,
          width: "100%",
          alignItems: "center"
        }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(244,63,94,0.1)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="shield-half" size={32} color="#f43f5e" />
          </View>
          
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#d4e4fa", marginBottom: 8, textAlign: "center" }}>
            Block {count} Apps?
          </Text>
          
          <Text style={{ fontSize: 14, color: "rgba(212,228,250,0.6)", textAlign: "center", marginBottom: 24, lineHeight: 20 }}>
            These apps will be blocked and inaccessible until all your pending tasks for today are completed. Are you sure you want to proceed?
          </Text>

          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <Pressable
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.05)",
                alignItems: "center"
              }}
              onPress={onCancel}
            >
              <Text style={{ color: "#d4e4fa", fontWeight: "600" }}>Cancel</Text>
            </Pressable>
            
            <Pressable
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                backgroundColor: "#f43f5e",
                alignItems: "center"
              }}
              onPress={onConfirm}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Yes, Block</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
