import React, { memo, useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import { HourlyViewProps } from "@/lib/interfaces";
import { days } from "@/constants/months";
import { toDateKey, formatHourLabel } from "../utils/date-utils";
import DayColumn from "./DayColumn";
import AddEventBottomSheet from "./AddTaskPopup";

/** HourlyView — single ScrollView: time-label column + event grid side by side.
 * Both scroll together — no sync needed. DayColumn handles tap/drag. */
function HourlyView({
  selectedDate,
  tasks,
  carriedForwardTasks = [],
  onAddTask,
  onMoveTask,
  onDeleteTask,
  draftStart,
  setDraftStart,
  draftEnd,
  setDraftEnd,
  isDragging,
  setIsDragging,
}: HourlyViewProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const hourHeight = 80;
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const showPopup = draftStart !== null && draftEnd !== null;

  const timelinePaddingBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(timelinePaddingBottom, {
      toValue: showPopup && !isDragging ? 280 : 0,
      useNativeDriver: false,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [showPopup, isDragging]);

  const dayName = days[selectedDate.getDay()];
  const dateNum = selectedDate.getDate();

  const handleDraftMove = (start: number, end: number) => {
    setDraftStart(start);
    setDraftEnd(end);
  };

  const handleClose = () => {
    setDraftStart(null);
    setDraftEnd(null);
  };

  const handleSave = (
    title: string,
    description: string,
    startHour: number,
    endHour: number,
  ) => {
    onAddTask({
      title,
      description,
      startTime: startHour,
      endTime: endHour,
      date: toDateKey(selectedDate),
      type: "task",
      status: "PENDING",
    });
    handleClose();
  };

  const handleDraftCreate = (start: number, end: number) => {
    setDraftStart(start);
    setDraftEnd(end);
  };

  return (
    <View className="flex-1 bg-[#051424]">
      {/* Date chip header */}
      <View className="flex-row items-center px-4 py-2.5 border-b border-white/5 bg-[#051424]">
        <Text className="text-xs font-semibold text-white/60 uppercase mr-2.5 tracking-wider">
          {dayName}
        </Text>
        <View className="w-8 h-8 rounded-full bg-[#44e2cd] items-center justify-center">
          <Text className="text-sm font-bold text-[#00201c]">
            {dateNum}
          </Text>
        </View>
      </View>

      {/* Single ScrollView — time labels + grid together */}
      <Animated.View style={{ flex: 1, marginBottom: timelinePaddingBottom }}>
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          className="flex-1 bg-[#051424]"
          contentContainerStyle={{ height: 24 * hourHeight }}
        >
          <View style={{ height: 24 * hourHeight }} className="flex-row">

            {/* Time label column — fixed 56px width */}
            <View className="w-14 border-r border-white/5">
              {hours.map((h) => (
                <View
                  key={h}
                  style={{ height: hourHeight }}
                  className="justify-start pt-1.5 px-2"
                >
                  <Text className="text-[10px] font-semibold text-white/45">
                    {formatHourLabel(h)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Event grid column — fills remaining width */}
            <View className="flex-1">
              <DayColumn
                selectedDate={selectedDate}
                tasks={tasks}
                hourHeight={hourHeight}
                scrollEnabled={scrollEnabled}
                setScrollEnabled={setScrollEnabled}
                draftStart={draftStart}
                draftEnd={draftEnd}
                onDraftMove={handleDraftMove}
                onDraftCreate={handleDraftCreate}
                onDragToggle={(dragging) => {
                  setScrollEnabled(!dragging);
                  setIsDragging(dragging);
                }}
                onEventMove={(id, s, e) => onMoveTask(id, s, e)}
              />
            </View>

          </View>
        </ScrollView>
      </Animated.View>

      {/* Add Task Popup */}
      <AddEventBottomSheet
        visible={showPopup}
        isDragging={isDragging}
        selectedDate={selectedDate}
        startHour={draftStart ?? 8}
        endHour={draftEnd ?? 10}
        onClose={handleClose}
        onSave={handleSave}
      />
    </View>
  );
}

export default memo(HourlyView);
