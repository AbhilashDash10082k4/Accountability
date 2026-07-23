import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  getInstalledApps,
  openAccessibilitySettings,
  openOverlaySettings,
  hasOverlayPermission,
  setBlockedApps as setNativeBlockedApps,
  getBlockedApps,
  AppInfo,
} from "../../modules/block-distractions";

interface AppSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AppSelectorModal: React.FC<AppSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockedApps, setBlockedApps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (visible && Platform.OS === "android") {
      loadApps();
    }
  }, [visible]);

  const loadApps = () => {
    setLoading(true);
    try {
      const installed = getInstalledApps();
      setApps(installed.sort((a, b) => a.name.localeCompare(b.name)));

      const stored = getBlockedApps();
      if (stored) {
        setBlockedApps(new Set(stored));
      }
    } catch (e) {
      console.error("Failed to load apps", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (packageName: string) => {
    const newSet = new Set(blockedApps);
    if (newSet.has(packageName)) {
      newSet.delete(packageName);
    } else {
      newSet.add(packageName);
    }
    setBlockedApps(newSet);
  };

  const handleSave = () => {
    setNativeBlockedApps(Array.from(blockedApps));
    onClose();
  };

  const checkPermissions = () => {
    if (!hasOverlayPermission()) {
      openOverlaySettings();
    } else {
      openAccessibilitySettings();
    }
  };

  if (Platform.OS !== "android") {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Apps to Block</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveBtn}>Save</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={checkPermissions}
        >
          <Text style={styles.permissionText}>
            Enable Permissions (Accessibility & Overlay)
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={apps}
            keyExtractor={(item) => item.packageName}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.appName}>{item.name}</Text>
                  <Text style={styles.pkgName}>{item.packageName}</Text>
                </View>
                <Switch
                  value={blockedApps.has(item.packageName)}
                  onValueChange={() => toggleApp(item.packageName)}
                />
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  saveBtn: { fontSize: 18, color: "#007AFF", fontWeight: "600" },
  permissionBtn: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  permissionText: { color: "#d9534f", fontWeight: "bold" },
  loader: { marginTop: 50 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f9f9f9",
  },
  itemInfo: { flex: 1 },
  appName: { fontSize: 16, fontWeight: "500" },
  pkgName: { fontSize: 12, color: "#888", marginTop: 4 },
});
