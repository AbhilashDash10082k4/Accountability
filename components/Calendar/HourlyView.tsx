import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import DraggableEvent from "./DraggableEvent";
import { HourlyViewProps, TimelineEvent } from "@/utils/interfaces";

export default function HourlyView({
  selectedDate,
  events,
  onEventMove,
}: HourlyViewProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const hourHeight = 80; // Height in pixels for 1 hour

  // Generate 24 hours list
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHourLabel = (h: number) => {
    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
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
      // Mock events mapping:
      // mock-1/2/3/4 map to May 25, 2026 or May 26, 2026
      if (evt.id.startsWith("mock-")) {
        const day = selectedDate.getDate();
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();

        if (year === 2026 && month === 4) {
          // May 2026
          if (day === 25) {
            // Monday mock items: Outing, Coding, Tv, Dinner, chess
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
            // Tuesday mock items: Due: App, Due: Cod, Sleep, Mrng routin
            return (
              evt.id === "mock-1" ||
              evt.id === "mock-2" ||
              evt.title.startsWith("Due:") ||
              evt.title === "Sleep" ||
              evt.title === "Mrng routin" ||
              evt.title === "Stage32 Did"
            );
          }
          if (day === 28 && evt.title === "Bakrid") return true;
          if (day === 29 && evt.title.startsWith("Bus to Bhub")) return true;
          if (day === 1 && evt.title === "Buddha Pur") return true;
        }
        return false;
      }
      return false; // Real calendar events would check date matching
    });
  };

  const dayEvents = getEventsForSelectedDay();

  // Position of now indicator (11:15 AM)
  const nowIndicatorTop = 11.25 * hourHeight;

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
          <View
            key={h}
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
          </View>
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

          {/* Now Indicator Line at 11:15 AM */}
          <View
            className="absolute left-0 right-0 flex-row items-center h-4 z-40"
            style={{ top: nowIndicatorTop - 8 }}
          >
            {/* Pulsing indicator dot */}
            <View className="w-3 h-3 bg-secondary rounded-full -ml-[6px] shadow shadow-secondary" />
            {/* Horizontal line */}
            <View className="h-[2px] flex-1 bg-secondary shadow shadow-secondary" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
