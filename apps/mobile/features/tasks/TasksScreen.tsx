import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "@/features/calendar/store/calendar-store";
import { toDateKey } from "@/features/calendar/utils/date-utils";
import { TaskDateHeader, TaskSectionHeader, TaskEmptyState, TaskCard } from "./components";
import AppSelectorModal from "@/features/blocking/components/AppSelectorModal";
import BlockConfirmationModal from "@/features/blocking/components/BlockConfirmationModal";
import BlockDistractionsModule from "@/modules/block-distractions/src/BlockDistractionsModule";

/** Tasks screen — shows tasks for selected date + carried-forward items.
 * Reads from shared calendar-store (Zustand). */
export default function TasksScreen() {
  const {
    tasks,
    selectedDate: selectedDateKey,
    setSelectedDate: setSelectedDateKey,
    updateTask,
    submitProof,
  } = useTaskStore();

  /* ---------- derived state ---------- */
  const selectedDate = useMemo(
    () => new Date(selectedDateKey + "T00:00:00"),
    [selectedDateKey],
  );

  const formattedDateStr = useMemo(
    () =>
      selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [selectedDate],
  );

  const dailyTasks = useMemo(
    () => tasks.filter((t) => t.date === selectedDateKey),
    [tasks, selectedDateKey],
  );

  const carriedForwardTasks = useMemo(() => {
    const todayStr = toDateKey(new Date());
    if (selectedDateKey < todayStr) return [];
    return tasks.filter(
      (t) => t.date < selectedDateKey && t.status !== "COMPLETED",
    );
  }, [tasks, selectedDateKey]);

  // Compute if any tasks are pending (used for locking app selector)
  const hasPendingTasks = useMemo(() => {
    return tasks.some(
      (t) => t.date <= toDateKey(new Date()) && t.status !== "COMPLETED"
    );
  }, [tasks]);

  // Unblock Logic State Check (Optimized)
  useEffect(() => {
    // We only care if we are in the present day context
    const todayStr = toDateKey(new Date());
    if (selectedDateKey !== todayStr) return;

    // Check if there are any blocked apps currently
    const blockedApps = BlockDistractionsModule.getBlockedApps();
    if (!blockedApps || blockedApps.length === 0) return;

    if (!hasPendingTasks) {
      // Unblock if all tasks are complete — clear both blocked_apps and pending_tasks
      BlockDistractionsModule.setBlockedApps([]);
      BlockDistractionsModule.setPendingTasks("");
    } else {
      // Update pending tasks string for the native overlay
      const pending = tasks.filter((t) => t.date <= todayStr && t.status !== "COMPLETED");
      const taskNames = pending.map((t) => t.title).join(", ");
      BlockDistractionsModule.setPendingTasks(taskNames || "Pending Tasks");
    }
  }, [tasks, selectedDateKey, hasPendingTasks]);

  /* ---------- Modals State ---------- */
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [pendingPackagesToBlock, setPendingPackagesToBlock] = useState<string[]>([]);

  const handleConfirmApps = (packages: string[]) => {
    if (packages.length === 0) return;
    setPendingPackagesToBlock(packages);
    setIsSelectorVisible(false);
    setIsConfirmVisible(true);
  };

  const executeBlockApps = () => {
    if (!BlockDistractionsModule.hasOverlayPermission()) {
      Alert.alert("Permission Required", "Please allow overlay permission to block apps.");
      BlockDistractionsModule.openOverlaySettings();
      return;
    }
    if (!BlockDistractionsModule.hasAccessibilityPermission()) {
      Alert.alert("Permission Required", "Please enable the Accountability App Blocker in Accessibility settings.");
      BlockDistractionsModule.openAccessibilitySettings();
      return;
    }
    BlockDistractionsModule.setBlockedApps(pendingPackagesToBlock);
    
    // Set pending tasks immediately when apps are blocked
    const todayStr = toDateKey(new Date());
    const pending = tasks.filter((t) => t.date <= todayStr && t.status !== "COMPLETED");
    const taskNames = pending.map((t) => t.title).join(", ");
    BlockDistractionsModule.setPendingTasks(taskNames || "Pending Tasks");

    setIsConfirmVisible(false);
    setPendingPackagesToBlock([]);
    // Optional: call API to save FocusSession here
  };


  /* ---------- actions ---------- */
  const handlePrevDay = () => {
    const d = new Date(selectedDateKey + "T00:00:00");
    d.setDate(d.getDate() - 1);
    setSelectedDateKey(toDateKey(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDateKey + "T00:00:00");
    d.setDate(d.getDate() + 1);
    setSelectedDateKey(toDateKey(d));
  };

  const handleSelectToday = () => {
    setSelectedDateKey(toDateKey(new Date()));
  };

  const handleStart = (id: string) => {
    updateTask(id, { status: "IN_PROGRESS" });
  };

  const handleSubmitProof = (
    id: string,
    type: "text" | "url" | "image" | "video",
    data: string,
  ) => {
    submitProof(id, type, data);
  };

  /* ---------- render ---------- */
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#051424" }}
      edges={["top", "bottom"]}
    >
      <TaskDateHeader
        formattedDate={formattedDateStr}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onSelectToday={handleSelectToday}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: "#051424" }}
        contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
      >
        {/* Carried Forward */}
        {carriedForwardTasks.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <TaskSectionHeader
              icon="alert-circle-outline"
              iconColor="#f43f5e"
              label="Carried Forward"
              count={carriedForwardTasks.length}
            />
            {carriedForwardTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                isCarriedForward
                onStart={handleStart}
                onSubmitProof={handleSubmitProof}
              />
            ))}
          </View>
        )}

        {/* Today's Schedule */}
        <View>
          <TaskSectionHeader
            icon="checkbox-marked-circle-outline"
            iconColor="#44e2cd"
            label="Today's Schedule"
            count={dailyTasks.length}
          />

          {dailyTasks.length === 0 && carriedForwardTasks.length === 0 ? (
            <TaskEmptyState />
          ) : (
            dailyTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onStart={handleStart}
                onSubmitProof={handleSubmitProof}
              />
            ))
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Button for App Blocking */}
      <Pressable
        onPress={() => setIsSelectorVisible(true)}
        style={{
          position: "absolute",
          bottom: 32,
          right: 24,
          backgroundColor: "#f43f5e",
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
          zIndex: 50, // Float over everything
        }}
      >
        <Ionicons name="shield-checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Block Apps</Text>
      </Pressable>

      <AppSelectorModal
        visible={isSelectorVisible}
        onClose={() => setIsSelectorVisible(false)}
        onConfirm={handleConfirmApps}
        locked={hasPendingTasks}
      />

      <BlockConfirmationModal
        visible={isConfirmVisible}
        count={pendingPackagesToBlock.length}
        onCancel={() => setIsConfirmVisible(false)}
        onConfirm={executeBlockApps}
      />
    </SafeAreaView>
  );
}
