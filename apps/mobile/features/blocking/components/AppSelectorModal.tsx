import React, { useEffect, useState } from "react";
import { Modal, View, Text, FlatList, Pressable, TextInput, Image, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BlockDistractionsModule from "@/modules/block-distractions/src/BlockDistractionsModule";

interface AppInfo {
  name: string;
  packageName: string;
  icon?: string;
}

interface AppSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedPackages: string[], appsInfo: AppInfo[]) => void;
  /** When true, already-blocked apps cannot be unchecked (tasks are pending) */
  locked?: boolean;
}

export default function AppSelectorModal({ visible, onClose, onConfirm, locked = false }: AppSelectorModalProps) {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (visible) {
      loadApps();
    }
  }, [visible]);

  const loadApps = () => {
    try {
      const installedApps = BlockDistractionsModule.getInstalledApps();
      // Sort alphabetically
      installedApps.sort((a: AppInfo, b: AppInfo) => a.name.localeCompare(b.name));
      setApps(installedApps);
      setFilteredApps(installedApps);
      
      const currentlyBlocked = BlockDistractionsModule.getBlockedApps();
      setSelectedPackages(new Set(currentlyBlocked));
    } catch (e) {
      console.error("Failed to load apps:", e);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredApps(apps);
    } else {
      const lowerQuery = text.toLowerCase();
      setFilteredApps(apps.filter((app) => app.name.toLowerCase().includes(lowerQuery)));
    }
  };

  const toggleSelection = (packageName: string) => {
    // If locked, prevent unchecking already-blocked apps
    if (locked && selectedPackages.has(packageName)) return;
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(packageName)) {
      newSelected.delete(packageName);
    } else {
      newSelected.add(packageName);
    }
    setSelectedPackages(newSelected);
  };

  const handleConfirm = () => {
    const selectedAppsInfo = apps.filter(app => selectedPackages.has(app.packageName));
    onConfirm(Array.from(selectedPackages), selectedAppsInfo);
  };

  const renderItem = ({ item }: { item: AppInfo }) => {
    const isSelected = selectedPackages.has(item.packageName);
    const isLocked = locked && isSelected;
    return (
      <Pressable 
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.05)",
          opacity: isLocked ? 0.5 : 1,
        }}
        onPress={() => toggleSelection(item.packageName)}
        disabled={isLocked}
      >
        <Ionicons 
          name={isSelected ? "checkbox" : "square-outline"} 
          size={24} 
          color={isSelected ? "#44e2cd" : "rgba(255,255,255,0.4)"} 
          style={{ marginRight: 12 }}
        />
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={{ width: 32, height: 32, marginRight: 12 }} />
        ) : (
          <View style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 12, borderRadius: 4 }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#d4e4fa", fontSize: 16, fontWeight: "500" }}>{item.name}</Text>
          <Text style={{ color: "rgba(212,228,250,0.5)", fontSize: 12 }}>{item.packageName}</Text>
        </View>
        {isLocked && (
          <Ionicons name="lock-closed" size={16} color="#f43f5e" style={{ marginLeft: 8 }} />
        )}
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={{
            height: "85%",
            backgroundColor: "#051424",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40
          }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#d4e4fa" }}>Select Apps to Block</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={24} color="#d4e4fa" />
              </Pressable>
            </View>

            {locked && (
              <View style={{
                backgroundColor: "rgba(244,63,94,0.15)",
                borderRadius: 8,
                padding: 10,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Ionicons name="lock-closed" size={14} color="#f43f5e" style={{ marginRight: 8 }} />
                <Text style={{ color: "#f43f5e", fontSize: 12, flex: 1 }}>
                  Tasks pending — blocked apps can't be unchecked
                </Text>
              </View>
            )}

            <TextInput
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 12,
                padding: 12,
                color: "#d4e4fa",
                marginBottom: 16,
              }}
              placeholder="Search apps..."
              placeholderTextColor="rgba(212,228,250,0.4)"
              value={searchQuery}
              onChangeText={handleSearch}
            />

            <FlatList
              data={filteredApps}
              keyExtractor={(item) => item.packageName}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Pressable
              style={{
                backgroundColor: "#44e2cd",
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 16
              }}
              onPress={handleConfirm}
            >
              <Text style={{ color: "#051424", fontWeight: "700", fontSize: 16 }}>Confirm Selection ({selectedPackages.size})</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
