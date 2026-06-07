import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { MonthViewProps, TimelineEvent } from "@/lib/interfaces";

export default function MonthView({
  currentDate,
  events,
  onDaySelect,
}: MonthViewProps) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to generate the 42-day calendar grid
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month
    const firstDayOfMonth = new Date(year, month, 1);
    // Day of the week firstDayOfMonth falls on (0 = Sunday, 6 = Saturday)
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Start date of the grid (may fall in the previous month)
    const gridStartDate = new Date(year, month, 1 - startDayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const nextDay = new Date(gridStartDate);
      nextDay.setDate(gridStartDate.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  const gridDays = getCalendarDays();
  const today = new Date();

  // Helper to filter events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((evt) => {
      if (evt.date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;
        return evt.date === dateKey;
      }

      // If mock event, we hardcode mock dates or map them to the corresponding calendar date
      if (evt.id.startsWith("mock-")) {
        // Map mock events:
        // mock-1/2/3/4 map to May 25, 2026 (Mon) or May 26, 2026 (Tue) based on title
        const day = date.getDate();
        const m = date.getMonth();
        const y = date.getFullYear();
        if (y === 2026 && m === 4) {
          // May 2026
          if (day === 25) {
            // Monday mock items: Outing, Coding, Tv, Dinner, chess, Code-tried to debug
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
            // Tuesday mock items: Due: App, Due: Cod, Mrng routin, Sleep
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

      // For real device events
      // Check if start date matches calendar grid date
      return false;
    });
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <View className="flex-1 bg-background pt-2 px-2">
      {/* Weekday Labels Header */}
      <View className="flex-row w-full mb-2">
        {weekdays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[11px] font-semibold text-on-surface-variant/60 font-geist">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 6x7 Days Grid */}
      <View className="flex-row flex-wrap w-full flex-1 border-t border-l border-white/5">
        {gridDays.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDate(day);

          return (
            <Pressable
              key={idx}
              onPress={() => onDaySelect(day)}
              className="border-r border-b border-white/5 flex-col"
              style={{
                width: "14.28%",
                height: "16%",
                paddingTop: 4,
                paddingHorizontal: 2,
              }}
            >
              {/* Day Number */}
              <View className="items-center mb-1">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    isToday ? "bg-secondary shadow shadow-secondary" : ""
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold font-inter ${
                      isToday
                        ? "text-on-secondary-fixed font-bold"
                        : isCurrentMonth
                          ? "text-on-surface"
                          : "text-on-surface-variant/30"
                    }`}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              </View>

              {/* Event Badge Strips inside Cell */}
              <View className="flex-1 flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((evt, eIdx) => {
                  let bgColor = "bg-sky-500/20";
                  let textColor = "text-sky-300";
                  let borderColor = "border-sky-500/30";

                  if (
                    evt.title?.startsWith("Due:") ||
                    evt.type === "deadline"
                  ) {
                    bgColor = "bg-rose-500/20";
                    textColor = "text-rose-300";
                    borderColor = "border-rose-500/30";
                  } else if (
                    evt.title === "Bakrid" ||
                    evt.title === "Buddha Pur"
                  ) {
                    bgColor = "bg-teal-500/20";
                    textColor = "text-teal-300";
                    borderColor = "border-teal-500/30";
                  }

                  return (
                    <View
                      key={evt.id}
                      className={`px-1 py-0.5 rounded-[2px] border ${bgColor} ${borderColor}`}
                    >
                      <Text
                        numberOfLines={1}
                        className={`text-[8px] font-medium font-geist leading-[10px] ${textColor}`}
                      >
                        {evt.title}
                      </Text>
                    </View>
                  );
                })}
                {dayEvents.length > 3 && (
                  <View className="px-1 items-start">
                    <Text className="text-[8px] text-on-surface-variant font-geist">
                      ...
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
