import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TimePickerModalProps {
  visible: boolean;
  initialTimeStr: string; // e.g. "1:00 AM" or "03:00 PM"
  onClose: () => void;
  onSelect: (timeStr: string) => void;
}

export default function TimePickerModal({
  visible,
  initialTimeStr,
  onClose,
  onSelect,
}: TimePickerModalProps) {
  // Parse initial time
  const parseInitialTime = () => {
    try {
      const parts = initialTimeStr.trim().split(" ");
      const period = parts[1] || "AM";
      const [hStr, mStr] = parts[0].split(":");
      let hour = parseInt(hStr, 10);
      let minute = parseInt(mStr, 10);
      if (isNaN(hour)) hour = 12;
      if (isNaN(minute)) minute = 0;
      return { hour, minute, period };
    } catch {
      return { hour: 12, minute: 0, period: "AM" };
    }
  };

  const parsed = parseInitialTime();
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);
  const [activeField, setActiveField] = useState<"hour" | "minute">("hour");

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Clock coordinates
  const radius = 80;
  const cx = 100;
  const cy = 100;

  const handleDialSelect = (val: number) => {
    if (activeField === "hour") {
      setSelectedHour(val);
      setActiveField("minute"); // Switch to minute automatically
    } else {
      setSelectedMinute(val);
    }
  };

  const handleOK = () => {
    const formattedHour = String(selectedHour).padStart(2, "0");
    const formattedMinute = String(selectedMinute).padStart(2, "0");
    onSelect(`${formattedHour}:${formattedMinute} ${period}`);
    onClose();
  };

  // Selected angle for center hand pointer
  const activeValue =
    activeField === "hour" ? selectedHour % 12 : selectedMinute / 5;
  const angle = (activeValue * 30 - 90) * (Math.PI / 180);
  const sx = cx + radius * Math.cos(angle);
  const sy = cy + radius * Math.sin(angle);
  const hx = (cx + sx) / 2;
  const hy = (cy + sy) / 2;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        {/* Dialog Container */}
        <View className="w-[300px] bg-[#221b19] rounded-[28px] p-6 shadow-2xl border border-white/5">
          {/* Header */}
          <Text className="text-[12px] font-bold text-[#e0a96d] uppercase tracking-wider mb-4">
            Select time
          </Text>

          {/* Time digits display */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-1">
              {/* Hour Box */}
              <Pressable
                onPress={() => setActiveField("hour")}
                delayLongPress={0}
                className={`w-16 h-16 rounded-xl justify-center items-center ${
                  activeField === "hour"
                    ? "bg-amber-500/20 border-2 border-amber-500"
                    : "bg-white/5"
                }`}
              >
                <Text className="text-3xl font-bold text-on-surface">
                  {String(selectedHour).padStart(2, "0")}
                </Text>
              </Pressable>

              <Text className="text-3xl font-bold text-on-surface px-1">:</Text>

              {/* Minute Box */}
              <Pressable
                onPress={() => setActiveField("minute")}
                delayLongPress={0}
                className={`w-16 h-16 rounded-xl justify-center items-center ${
                  activeField === "minute"
                    ? "bg-amber-500/20 border-2 border-amber-500"
                    : "bg-white/5"
                }`}
              >
                <Text className="text-3xl font-bold text-on-surface">
                  {String(selectedMinute).padStart(2, "0")}
                </Text>
              </Pressable>
            </View>

            {/* AM/PM Toggle */}
            <View className="border border-white/10 rounded-xl overflow-hidden">
              <Pressable
                onPress={() => setPeriod("AM")}
                delayLongPress={0}
                className={`px-3 py-2 items-center justify-center ${
                  period === "AM" ? "bg-amber-500/20" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${period === "AM" ? "text-amber-400" : "text-on-surface-variant/60"}`}
                >
                  AM
                </Text>
              </Pressable>
              <View className="h-[1px] bg-white/10" />
              <Pressable
                onPress={() => setPeriod("PM")}
                delayLongPress={0}
                className={`px-3 py-2 items-center justify-center ${
                  period === "PM" ? "bg-amber-500/20" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${period === "PM" ? "text-amber-400" : "text-on-surface-variant/60"}`}
                >
                  PM
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Clock Dial Circle */}
          <View className="items-center justify-center my-4">
            <View className="w-[200px] h-[200px] rounded-full bg-white/5 items-center justify-center relative">
              {/* Pointer Hand Line */}
              <View
                style={{
                  position: "absolute",
                  left: hx - 1,
                  top: hy - 1,
                  width: 2,
                  height: radius,
                  backgroundColor: "#e0a96d",
                  transform: [
                    {
                      rotate: `${activeField === "hour" ? selectedHour * 30 : selectedMinute * 6}deg`,
                    },
                  ],
                }}
              />

              {/* Center Dot */}
              <View className="absolute w-2 h-2 rounded-full bg-[#e0a96d]" />

              {/* Active selection dot */}
              <View
                style={{
                  position: "absolute",
                  left: sx - 14,
                  top: sy - 14,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "rgba(224, 169, 109, 0.4)",
                  borderWidth: 1.5,
                  borderColor: "#e0a96d",
                }}
              />

              {/* Render digits along the circle */}
              {activeField === "hour"
                ? hours.map((h) => {
                    const hAngle = ((h % 12) * 30 - 90) * (Math.PI / 180);
                    const hx = cx + radius * Math.cos(hAngle);
                    const hy = cy + radius * Math.sin(hAngle);
                    const isSelected = selectedHour === h;
                    return (
                      <Pressable
                        key={h}
                        onPress={() => handleDialSelect(h)}
                        delayLongPress={0}
                        style={{
                          position: "absolute",
                          left: hx - 15,
                          top: hy - 15,
                          width: 30,
                          height: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          className={`text-xs font-semibold ${isSelected ? "text-amber-400 font-bold" : "text-on-surface"}`}
                        >
                          {h}
                        </Text>
                      </Pressable>
                    );
                  })
                : minutes.map((m) => {
                    const mAngle = ((m / 5) * 30 - 90) * (Math.PI / 180);
                    const mx = cx + radius * Math.cos(mAngle);
                    const my = cy + radius * Math.sin(mAngle);
                    const isSelected = selectedMinute === m;
                    return (
                      <Pressable
                        key={m}
                        onPress={() => handleDialSelect(m)}
                        delayLongPress={0}
                        style={{
                          position: "absolute",
                          left: mx - 15,
                          top: my - 15,
                          width: 30,
                          height: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          className={`text-xs font-semibold ${isSelected ? "text-amber-400 font-bold" : "text-on-surface"}`}
                        >
                          {String(m).padStart(2, "0")}
                        </Text>
                      </Pressable>
                    );
                  })}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between items-center mt-6">
            <Pressable hitSlop={8} className="p-2">
              <Ionicons name="keypad-outline" size={20} color="#c6c6cb" />
            </Pressable>

            <View className="flex-row gap-4">
              <Pressable onPress={onClose} hitSlop={8} className="px-3 py-2">
                <Text className="text-sm font-bold text-on-surface-variant/60">
                  Cancel
                </Text>
              </Pressable>
              <Pressable onPress={handleOK} hitSlop={8} className="px-3 py-2">
                <Text className="text-sm font-bold text-amber-400">OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
