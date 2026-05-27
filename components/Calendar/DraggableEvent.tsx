import React, { useRef, useState, useEffect } from "react";
import { Animated, PanResponder, Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DraggableEventProps, TimelineEvent } from "@/utils/interfaces";

export default function DraggableEvent({
  event,
  hourHeight,
  onDragEnd,
  onDragToggle,
}: DraggableEventProps) {
  // Parse start hour (e.g., "08:00" -> 8.0)
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
  };

  // Convert float hour back to "HH:MM" format
  const formatTime = (hourFloat: number) => {
    const hours = Math.floor(hourFloat);
    const minutes = Math.round((hourFloat - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const initialHour = parseTime(event.time);
  const initialTop = initialHour * hourHeight;

  // Determine height based on event length (Dinner, chess is 2 hours, others 1 hour)
  const eventDurationHours = event.title === "Dinner, chess" ? 2 : 1;
  const cardHeight = eventDurationHours * hourHeight - 8; // Small margin top/bottom

  // Animation values
  const panY = useRef(new Animated.Value(initialTop)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const zIndex = useRef(new Animated.Value(10)).current;

  const [isDragging, setIsDragging] = useState(false);

  // Sync position if event time changes from outside
  useEffect(() => {
    if (!isDragging) {
      Animated.spring(panY, {
        toValue: initialTop,
        useNativeDriver: false,
      }).start();
    }
  }, [event.time, initialTop, isDragging]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        onDragToggle(true);
        zIndex.setValue(999);

        // Scale up slightly and lift
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();

        // Save original position
        panY.setOffset((panY as any)._value);
        panY.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Drag vertically only
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        onDragToggle(false);
        zIndex.setValue(10);

        // Flatten offset into value
        panY.flattenOffset();

        // Calculate snap position to nearest half hour slot (0.5)
        const finalTop = (panY as any)._value;
        const rawHour = finalTop / hourHeight;
        const snappedHour = Math.max(
          0,
          Math.min(23, Math.round(rawHour * 2) / 2),
        );
        const snappedTop = snappedHour * hourHeight;

        // Animate snap and scale back down
        Animated.parallel([
          Animated.spring(panY, {
            toValue: snappedTop,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 1.0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          const newTimeStr = formatTime(snappedHour);
          onDragEnd(event.id, newTimeStr);
        });
      },
    }),
  ).current;

  // Visual customizer based on type
  let colorClasses = "bg-sky-500/20 border-sky-500/40 text-sky-200";
  let iconColor = "#38bdf8";
  if (event.type === "deadline") {
    colorClasses = "bg-rose-500/20 border-rose-500/40 text-rose-200";
    iconColor = "#fb7185";
  } else if (event.type === "habit") {
    colorClasses = "bg-teal-500/20 border-teal-500/40 text-teal-200";
    iconColor = "#2dd4bf";
  } else if (event.type === "completed") {
    colorClasses =
      "bg-white/5 border-white/10 text-on-surface-variant/40 line-through opacity-40";
    iconColor = "#94a3b8";
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        top: panY,
        left: 8,
        right: 8,
        height: cardHeight,
        transform: [{ scale }],
        zIndex,
      }}
      className={`rounded-2xl p-4 justify-between border ${colorClasses}`}
    >
      <View>
        <View className="flex-row justify-between items-start">
          <Text
            className="text-base font-bold text-on-surface font-inter"
            style={{ flexShrink: 1 }}
          >
            {event.title}
          </Text>
          {event.iconName && (
            <MaterialCommunityIcons
              name={event.iconName as any}
              size={18}
              color={iconColor}
            />
          )}
        </View>

        {event.description && (
          <Text
            className="text-xs text-on-surface-variant font-geist mt-1"
            numberOfLines={2}
          >
            {event.description}
          </Text>
        )}
      </View>

      <View className="flex-row justify-between items-center mt-2 border-t border-white/5 pt-2">
        <Text className="text-[10px] font-semibold text-on-surface-variant font-geist">
          {event.time} ({eventDurationHours} hr
          {eventDurationHours > 1 ? "s" : ""})
        </Text>
        {isDragging && (
          <MaterialCommunityIcons
            name="drag-vertical"
            size={14}
            color={iconColor}
          />
        )}
      </View>
    </Animated.View>
  );
}
