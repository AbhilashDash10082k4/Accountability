import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  PanResponder,
  ScrollView,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddEventBottomSheetProps } from "@/lib/interfaces";
import { days, months } from "@/constants/months";
import { hourFloatToTimeStr } from "../utils/date-utils";

const COMPACT_H = 300;

export default function AddEventBottomSheet({
  visible,
  isDragging = false,
  selectedDate,
  startHour,
  endHour,
  onClose,
  onSave,
}: AddEventBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [visibleHeight, setVisibleHeight] = useState(windowHeight);
  const [isExpanded, setIsExpanded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(startHour);
  const [end, setEnd] = useState(endHour);

  // Compute dynamic height based on viewport
  const SCREEN_H = visibleHeight;

  const hiddenY = SCREEN_H;
  const compactY = SCREEN_H - COMPACT_H;
  const expandedY = insets.top + 12;

  const sheetY = useRef(new Animated.Value(SCREEN_H)).current;
  const dragAnim = useRef(new Animated.Value(0)).current;

  // Initialize values when opening
  useEffect(() => {
    if (visible) {
      setStart(startHour);
      setEnd(endHour);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    }
  }, [visible, startHour, endHour]);

  // Control animations
  useEffect(() => {
    if (visible) {
      const toVal = isExpanded ? expandedY : compactY;
      Animated.spring(sheetY, {
        toValue: toVal,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.spring(sheetY, {
        toValue: hiddenY,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    }
  }, [visible, isExpanded, compactY, expandedY, hiddenY]);

  // Minimize when dragging in DayColumn
  useEffect(() => {
    Animated.spring(dragAnim, {
      toValue: isDragging ? COMPACT_H : 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [isDragging]);

  // Bottom sheet drag responder
  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetY.setOffset((sheetY as any)._value);
        sheetY.setValue(0);
      },
      onPanResponderMove: (_evt, gestureState) => {
        let newY = gestureState.dy;
        const offset = (sheetY as any)._offset;
        const finalVal = offset + newY;
        if (finalVal < expandedY) newY = expandedY - offset;
        else if (finalVal > hiddenY) newY = hiddenY - offset;
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        sheetY.flattenOffset();
        const currentVal = (sheetY as any)._value;

        // Dismiss if swiped down far enough
        if (gestureState.vy > 1.5 || currentVal > compactY + 80) {
          onClose();
          return;
        }

        // Expand or return to compact
        const toVal = (gestureState.vy < -0.5 || currentVal < compactY - 80) ? expandedY : compactY;
        setIsExpanded(toVal === expandedY);

        Animated.spring(sheetY, {
          toValue: toVal,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }).start();
      },
    }),
  ).current;

  const formatDateStr = (date: Date) => {
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    return `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim(), start, end);
    onClose();
  };

  const canSave = title.trim().length > 0;

  const Container = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const containerProps = Platform.OS === "ios"
    ? { behavior: "height" as const, style: { position: "absolute" as const, top: 0, bottom: 0, left: 0, right: 0 } }
    : { style: { position: "absolute" as const, top: 0, bottom: 0, left: 0, right: 0 } };

  return (
    <Container
      {...containerProps}
      onLayout={(e) => {
        setVisibleHeight(e.nativeEvent.layout.height);
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: Animated.add(sheetY, dragAnim) }],
          zIndex: 100,
          height: SCREEN_H,
          paddingBottom: insets.bottom + 8,
        }}
        className="bg-[#0d1f33] rounded-t-[28px] border-t border-white/8 shadow-2xl elevation-8 overflow-hidden pt-2"
      >
        {/* Drag Handle at top of sheet */}
        <View
          {...sheetPanResponder.panHandlers}
          className="w-full py-3 items-center"
        >
          <View className="w-10 h-1 bg-white/20 rounded-full" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header: Close + Save */}
          <View className="flex-row justify-between items-center mb-5">
            <Pressable onPress={onClose} hitSlop={12} className="p-1">
              <Ionicons name="close" size={24} color="#d4e4fa" />
            </Pressable>

            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              className={`px-6 py-2 rounded-full ${
                canSave ? "bg-[#e0a96d]" : "bg-white/8"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  canSave ? "text-[#051424]" : "text-white/40"
                }`}
              >
                Save
              </Text>
            </Pressable>
          </View>

          {/* Title Input */}
          <TextInput
            autoFocus={true}
            placeholder="Add title"
            placeholderTextColor="rgba(212,228,250,0.3)"
            value={title}
            onChangeText={setTitle}
            className="text-2xl font-semibold text-[#d4e4fa] border-b border-white/8 pb-2.5 mb-4"
          />

          {/* Description Input */}
          <TextInput
            placeholder="Add description (optional)"
            placeholderTextColor="rgba(212,228,250,0.25)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2}
            className="text-sm text-[#d4e4fa] border-b border-white/8 pb-2.5 mb-4 min-h-[44px] text-left"
            style={{ textAlignVertical: "top" }}
          />

          {/* Task type badge */}
          <View className="flex-row mb-5">
            <View className="px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-xl">
              <Text className="text-xs font-bold text-amber-400">Task</Text>
            </View>
          </View>

          {/* Date & Time Row */}
          <View className="flex-row items-center justify-between py-3.5 border-t border-b border-white/5 mb-3.5">
            <View className="flex-row items-center gap-2.5">
              <Ionicons
                name="time-outline"
                size={18}
                color="rgba(212,228,250,0.5)"
              />
              <Text className="text-xs text-[#d4e4fa] font-medium">
                {formatDateStr(selectedDate)}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <View className="px-3 py-1.5 bg-white/6 rounded-lg border border-white/8">
                <Text className="text-xs font-semibold text-[#d4e4fa]">
                  {hourFloatToTimeStr(start)}
                </Text>
              </View>

              <Text className="text-white/50 text-sm">–</Text>

              <View className="px-3 py-1.5 bg-white/6 rounded-lg border border-white/8">
                <Text className="text-xs font-semibold text-[#d4e4fa]">
                  {hourFloatToTimeStr(end)}
                </Text>
              </View>
            </View>
          </View>

          {/* Duration */}
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="hourglass-outline"
              size={14}
              color="rgba(212,228,250,0.35)"
            />
            <Text className="text-xs text-white/50">
              Duration: {((end - start) * 60).toFixed(0)} min
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Container>
  );
}
