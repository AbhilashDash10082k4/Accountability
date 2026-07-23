import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { MonthViewProps } from "@/lib/interfaces";
import { getTasksForDate } from "../selectors/get-tasks-for-date";
import { getCalendarDays } from "../selectors/get-calendar-days";
import { isSameDay } from "../utils/date-utils";
import { days } from "@/constants/months";

function MonthView({
  currentDate,
  tasks,
  onDaySelect,
}: MonthViewProps) {
  const gridDays = getCalendarDays(currentDate);
  const today = new Date();

  // Chunk 42 flat days into 6 rows × 7 cols
  const rows: Date[][] = Array.from({ length: 6 }, (_, r) =>
    gridDays.slice(r * 7, r * 7 + 7),
  );

  return (
    <View className="flex-1 bg-background pt-2">
      {/* Weekday Labels */}
      <View className="flex-row w-full mb-1">
        {days.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[11px] font-semibold text-[#c6c6cb] opacity-60">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid — 6 rows, each fills remaining height equally */}
      <View className="flex-1 flex-col border-t border-l border-white/10">
        {rows.map((week, rowIdx) => (
          <View key={rowIdx} className="flex-1 flex-row">
            {week.map((date, colIdx) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(date, today);
              const dayTasks = getTasksForDate(tasks, date);

              return (
                <Pressable
                  key={colIdx}
                  onPress={() => onDaySelect(date)}
                  className="flex-1 border-r border-b border-white/10 pt-1 px-1 active:bg-white/5"
                >
                  {/* Day Number */}
                  <View className="items-center mb-1">
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        isToday 
                          ? "bg-secondary shadow-md shadow-secondary/50 elevation-3" 
                          : "bg-transparent"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          isToday
                            ? "font-bold text-[#00201c]"
                            : isCurrentMonth
                              ? "font-semibold text-on-surface"
                              : "font-semibold text-[#c6c6cb] opacity-30"
                        }`}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </View>

                  {/* Task indicator strips */}
                  <View className="flex-1 overflow-hidden gap-[2px]">
                    {dayTasks.slice(0, 3).map((task) => (
                      <View
                        key={task.id}
                        className="px-1 py-[1px] rounded-sm border-l-2"
                        style={{
                          backgroundColor: task.color + "30",
                          borderLeftColor: task.color,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          className="text-[8px] font-medium text-on-surface leading-[10px]"
                        >
                          {task.title}
                        </Text>
                      </View>
                    ))}
                    {dayTasks.length > 3 && (
                      <Text className="text-[8px] text-[#c6c6cb] opacity-60 px-1">
                        +{dayTasks.length - 3} more
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(MonthView);
