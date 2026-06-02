import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, PanResponder, Pressable } from "react-native";
import DraggableEvent from "./DraggableEvent";
import AddEventBottomSheet from "./AddEventBottomSheet";
import { HourlyViewProps, TimelineEvent } from "@/utils/interfaces";

export default function HourlyView({
  selectedDate,
  events,
  onEventMove,
  onAddEvent,
}: HourlyViewProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const hourHeight = 80; // Height in pixels for 1 hour

  // Now indicator dynamic logic
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isToday =
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  const currentHourFloat = now.getHours() + now.getMinutes() / 60;
  const nowIndicatorTop = currentHourFloat * hourHeight;

  // Task creation draft state
  const [draftStart, setDraftStart] = useState<number | null>(null);
  const [draftEnd, setDraftEnd] = useState<number | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Refs to prevent stale closures in PanResponder
  const draftStartRef = useRef(draftStart);
  const draftEndRef = useRef(draftEnd);

  useEffect(() => {
    draftStartRef.current = draftStart;
    draftEndRef.current = draftEnd;
  }, [draftStart, draftEnd]);

  // Generate 24 hours list
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHourLabel = (h: number) => {
    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
  };

  const formatHourToTimeStr = (hourFloat: number) => {
    const h = Math.floor(hourFloat);
    const m = Math.round((hourFloat - h) * 60);
    const period = h < 12 || h === 24 ? "AM" : "PM";
    const displayHour = h === 0 || h === 24 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
  };

  // Get weekday name and day number (e.g., "Mon 25")
  const getDayHeader = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[selectedDate.getDay()];
    const dateNum = selectedDate.getDate();
    return { dayName, dateNum };
  };

  const { dayName, dateNum } = getDayHeader();

  // Filter events for the selected day
  const getEventsForSelectedDay = () => {
    return events.filter((evt) => {
      // Dynamic added task check
      if (evt.date) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;
        return evt.date === dateKey;
      }

      // Mock events mapping
      if (evt.id.startsWith("mock-")) {
        const day = selectedDate.getDate();
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();

        if (year === 2026 && month === 4) {
          if (day === 25) {
            return (
              evt.id === "mock-3" ||
              evt.id === "mock-4" ||
              evt.title === "Outing" ||
              evt.title === "Coding" ||
              evt.title === "Tv" ||
              evt.title === "Dinner, chess"
            );
          }
          if (day === 26) {
            return (
              evt.id === "mock-1" ||
              evt.id === "mock-2" ||
              evt.title?.startsWith("Due:") ||
              evt.title === "Sleep" ||
              evt.title === "Mrng routin" ||
              evt.title === "Stage32 Did"
            );
          }
          if (day === 28 && evt.title === "Bakrid") return true;
          if (day === 29 && evt.title?.startsWith("Bus to Bhub")) return true;
          if (day === 1 && evt.title === "Buddha Pur") return true;
        }
        return false;
      }
      return false;
    });
  };

  const dayEvents = getEventsForSelectedDay();

  // Drag Responders
  const dragStartRef = useRef(0);
  const dragTimeRef = useRef(0);

  const topPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setScrollEnabled(false);
        dragStartRef.current = draftStartRef.current ?? 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaHours = gestureState.dy / hourHeight;
        let newStart = dragStartRef.current + deltaHours;
        const currentEnd = draftEndRef.current ?? 2;
        newStart = Math.max(0, Math.min(currentEnd - 0.25, newStart));
        newStart = Math.round(newStart * 4) / 4;
        setDraftStart(newStart);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
      },
    })
  ).current;

  const bottomPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setScrollEnabled(false);
        dragStartRef.current = draftEndRef.current ?? 2;
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaHours = gestureState.dy / hourHeight;
        let newEnd = dragStartRef.current + deltaHours;
        const currentStart = draftStartRef.current ?? 0;
        newEnd = Math.max(currentStart + 0.25, Math.min(24, newEnd));
        newEnd = Math.round(newEnd * 4) / 4;
        setDraftEnd(newEnd);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
      },
    })
  ).current;

  const bodyPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setScrollEnabled(false);
        dragStartRef.current = draftStartRef.current ?? 0;
        dragTimeRef.current = (draftEndRef.current ?? 2) - (draftStartRef.current ?? 0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaHours = gestureState.dy / hourHeight;
        let newStart = dragStartRef.current + deltaHours;
        const duration = dragTimeRef.current;
        newStart = Math.max(0, Math.min(24 - duration, newStart));
        newStart = Math.round(newStart * 4) / 4;
        setDraftStart(newStart);
        setDraftEnd(newStart + duration);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
      },
    })
  ).current;

  const handleRowPress = (h: number) => {
    if (draftStart !== null) {
      setDraftStart(null);
      setDraftEnd(null);
      setShowBottomSheet(false);
      return;
    }
    setDraftStart(h);
    setDraftEnd(Math.min(24, h + 2));
    setShowBottomSheet(true);
  };

  const handleClose = () => {
    setDraftStart(null);
    setDraftEnd(null);
    setShowBottomSheet(false);
  };

  const handleSave = (title: string, description: string, startTime: string, endTime: string) => {
    const formatToTimeKey = (timeStr: string) => {
      const parts = timeStr.trim().split(" ");
      const [hStr, mStr] = parts[0].split(":");
      let h = parseInt(hStr, 10);
      const m = mStr;
      const period = parts[1] || "AM";
      if (period === "PM" && h < 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${m}`;
    };

    const durationVal = (draftEnd || 0) - (draftStart || 0);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const newEvent: TimelineEvent = {
      id: `custom-task-${Date.now()}`,
      title,
      description,
      time: formatToTimeKey(startTime),
      duration: String(durationVal),
      type: "task",
      date: dateKey,
      iconName: "checkbox-marked-circle-outline",
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    setDraftStart(null);
    setDraftEnd(null);
    setShowBottomSheet(false);
  };

  return (
    <View className="flex-1 bg-background flex-row">
      {/* Sticky Left Date Column */}
      <View className="w-16 items-center pt-4 border-r border-white/5 bg-background">
        <Text className="text-xs font-semibold text-on-surface-variant font-geist uppercase">
          {dayName}
        </Text>
        <Text className="text-2xl font-bold text-on-surface font-inter mt-1">
          {dateNum}
        </Text>
      </View>

      {/* Main Hourly Timeline Scroll View */}
      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: 24 * hourHeight,
          position: "relative",
        }}
        className="flex-grow bg-background"
      >
        {/* Hour Grid Rows Background */}
        {hours.map((h) => (
          <Pressable
            key={h}
            onPress={() => handleRowPress(h)}
            style={{ height: hourHeight }}
            className="flex-row items-start border-b border-white/5 relative"
          >
            {/* Hour Label */}
            <Text
              className="absolute left-3 text-[10px] font-semibold text-on-surface-variant/40 font-geist"
              style={{ top: 8 }}
            >
              {formatHourLabel(h)}
            </Text>
          </Pressable>
        ))}

        {/* Draggable Event Cards overlay */}
        <View className="absolute inset-0 left-16 right-0">
          {dayEvents.map((evt) => (
            <DraggableEvent
              key={evt.id}
              event={evt}
              hourHeight={hourHeight}
              onDragToggle={(isDragging) => setScrollEnabled(!isDragging)}
              onDragEnd={onEventMove}
            />
          ))}

          {/* Highlighted draggable duration setter */}
          {draftStart !== null && draftEnd !== null && (
            <>
              {/* Body Box */}
              <View
                style={{
                  position: "absolute",
                  top: draftStart * hourHeight,
                  height: (draftEnd - draftStart) * hourHeight,
                  left: 8,
                  right: 8,
                  borderColor: "#44e2cd",
                  borderWidth: 2,
                  borderRadius: 12,
                  backgroundColor: "rgba(68, 226, 205, 0.15)",
                  zIndex: 50,
                }}
                {...bodyPanResponder.panHandlers}
              />
              {/* Top Handle Sibling */}
              <View
                {...topPanResponder.panHandlers}
                style={{
                  position: "absolute",
                  top: draftStart * hourHeight - 8,
                  left: 12,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#44e2cd",
                  borderWidth: 2,
                  borderColor: "#ffffff",
                  zIndex: 60,
                }}
              />
              {/* Bottom Handle Sibling */}
              <View
                {...bottomPanResponder.panHandlers}
                style={{
                  position: "absolute",
                  top: draftEnd * hourHeight - 8,
                  right: 12,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#44e2cd",
                  borderWidth: 2,
                  borderColor: "#ffffff",
                  zIndex: 60,
                }}
              />
            </>
          )}

          {/* Now Indicator Line (Only on today) */}
          {isToday && (
            <View
              className="absolute left-0 right-0 flex-row items-center h-4 z-40"
              style={{ top: nowIndicatorTop - 8 }}
            >
              {/* Pulsing indicator dot */}
              <View className="w-3 h-3 bg-white rounded-full -ml-[6px] shadow shadow-white" />
              {/* Horizontal line */}
              <View className="h-[1px] flex-1 bg-white shadow shadow-white" />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Task Bottom Sheet */}
      <AddEventBottomSheet
        visible={showBottomSheet}
        selectedDate={selectedDate}
        startTimeStr={formatHourToTimeStr(draftStart ?? 8)}
        endTimeStr={formatHourToTimeStr(draftEnd ?? 10)}
        onClose={handleClose}
        onSave={handleSave}
      />
    </View>
  );
}
