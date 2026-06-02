import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Animated, PanResponder, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TimePickerModal from "./TimePickerModal";

interface AddEventBottomSheetProps {
  visible: boolean;
  selectedDate: Date;
  startTimeStr: string; // e.g. "01:00 AM"
  endTimeStr: string;   // e.g. "03:00 AM"
  onClose: () => void;
  onSave: (title: string, description: string, startTime: string, endTime: string) => void;
}

export default function AddEventBottomSheet({
  visible,
  selectedDate,
  startTimeStr,
  endTimeStr,
  onClose,
  onSave,
}: AddEventBottomSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(startTimeStr);
  const [end, setEnd] = useState(endTimeStr);
  const [pickerTarget, setPickerTarget] = useState<"start" | "end" | null>(null);

  // Animated vertical translation value
  const sheetY = useRef(new Animated.Value(0)).current;

  // Sync state if props change when reopened
  useEffect(() => {
    setStart(startTimeStr);
    setEnd(endTimeStr);
    setTitle("");
    setDescription("");
    sheetY.setValue(0); // Reset position on open
  }, [startTimeStr, endTimeStr, visible]);

  // Expand / collapse gesture responder
  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetY.setOffset((sheetY as any)._value);
        sheetY.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        let newY = gestureState.dy;
        const offset = (sheetY as any)._offset;
        const finalVal = offset + newY;
        // Restrict drag bounds: cannot drag below 0 or above -350
        if (finalVal > 0) {
          newY = -offset;
        } else if (finalVal < -350) {
          newY = -350 - offset;
        }
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (evt, gestureState) => {
        sheetY.flattenOffset();
        const currentVal = (sheetY as any)._value;
        if (currentVal < -120) {
          // Snap to fully expanded position
          Animated.spring(sheetY, {
            toValue: -300,
            useNativeDriver: true,
          }).start();
        } else {
          // Snap back to default bottom position
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const formatDateStr = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();
    return `${dayName}, ${monthName} ${dateNum}, ${year}`;
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title, description, start, end);
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Dimmed Background Overlay */}
      <View className="flex-1 justify-end bg-black/50">
        {/* Click away dismiss backdrop */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full"
        >
          <Animated.View
            style={{ transform: [{ translateY: sheetY }] }}
            className="w-full rounded-t-[32px] border-t border-white/10 bg-[#1e1512] shadow-2xl overflow-hidden"
          >
            {/* Grabber Area / Drag Handle */}
            <View
              {...sheetPanResponder.panHandlers}
              className="w-full py-3 items-center active:opacity-75"
            >
              <View className="w-10 h-1 bg-white/20 rounded-full" />
            </View>

            <View className="px-6 pb-8">
              {/* Header Controls */}
              <View className="flex-row justify-between items-center mb-4">
                <Pressable onPress={onClose} hitSlop={8} className="p-2">
                  <Ionicons name="close" size={24} color="#f5ebe6" />
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={!title.trim()}
                  className={`px-6 py-2 rounded-full ${title.trim() ? "bg-[#e0a96d]" : "bg-white/10"}`}
                >
                  <Text className={`text-sm font-bold ${title.trim() ? "text-[#1e1512]" : "text-on-surface-variant/40"}`}>
                    Save
                  </Text>
                </Pressable>
              </View>

              {/* Title Input */}
              <TextInput
                placeholder="Add title"
                placeholderTextColor="rgba(245, 235, 230, 0.3)"
                value={title}
                onChangeText={setTitle}
                className="text-2xl font-semibold text-[#f5ebe6] border-b border-white/5 pb-2 mb-4 font-inter"
              />

              {/* Description Input */}
              <TextInput
                placeholder="Add description"
                placeholderTextColor="rgba(245, 235, 230, 0.3)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
                className="text-sm text-[#f5ebe6] border-b border-white/5 pb-2 mb-4 font-geist"
                style={{ minHeight: 40, textAlignVertical: "top" }}
              />

              {/* Type Tag Block */}
              <View className="flex-row gap-2 mb-4">
                <View className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                  <Text className="text-xs font-bold text-amber-400">
                    Task
                  </Text>
                </View>
              </View>

              {/* Date / Time Inputs block */}
              <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="time-outline" size={20} color="rgba(245, 235, 230, 0.6)" />
                  <Text className="text-sm font-medium text-[#f5ebe6] font-geist">
                    {formatDateStr(selectedDate)}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setPickerTarget("start")}
                    className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 active:bg-white/10"
                  >
                    <Text className="text-xs font-semibold text-[#f5ebe6]">
                      {start}
                    </Text>
                  </Pressable>
                  <Text className="text-[#f5ebe6] self-center">–</Text>
                  <Pressable
                    onPress={() => setPickerTarget("end")}
                    className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 active:bg-white/10"
                  >
                    <Text className="text-xs font-semibold text-[#f5ebe6]">
                      {end}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* TimePicker Modal integration */}
              <TimePickerModal
                visible={pickerTarget !== null}
                initialTimeStr={pickerTarget === "start" ? start : end}
                onClose={() => setPickerTarget(null)}
                onSelect={(timeStr) => {
                  if (pickerTarget === "start") {
                    setStart(timeStr);
                  } else if (pickerTarget === "end") {
                    setEnd(timeStr);
                  }
                }}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
