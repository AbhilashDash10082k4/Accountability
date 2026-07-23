import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimePickerModalProps } from "@/lib/interfaces";

export default function TimePickerModal({
  visible,
  initialHour,
  initialMinute,
  initialPeriod,
  onClose,
  onSelect,
}: TimePickerModalProps) {
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [period, setPeriod] = useState<"AM" | "PM">(initialPeriod);
  const [activeField, setActiveField] = useState<"hour" | "minute">("hour");

  // Reset state when modal opens with new values
  React.useEffect(() => {
    if (visible) {
      setSelectedHour(initialHour);
      setSelectedMinute(initialMinute);
      setPeriod(initialPeriod);
      setActiveField("hour");
    }
  }, [visible, initialHour, initialMinute, initialPeriod]);

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const radius = 80;
  const cx = 100;
  const cy = 100;

  const handleDialSelect = (val: number) => {
    if (activeField === "hour") {
      setSelectedHour(val);
      setActiveField("minute");
    } else {
      setSelectedMinute(val);
    }
  };

  const handleOK = () => {
    onSelect(selectedHour, selectedMinute, period);
    onClose();
  };

  // Clock hand pointer geometry
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

              <Text className="text-3xl font-bold text-on-surface px-1">
                :
              </Text>

              {/* Minute Box */}
              <Pressable
                onPress={() => setActiveField("minute")}
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

          {/* Clock Dial */}
          <View className="items-center justify-center my-4">
            <View className="w-[200px] h-[200px] rounded-full bg-white/5 items-center justify-center relative">
              {/* Pointer Hand */}
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

              {/* Selection highlight */}
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

              {/* Dial numbers */}
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
