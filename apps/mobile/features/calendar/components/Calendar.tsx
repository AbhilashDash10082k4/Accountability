import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { months } from "@/constants/months";
import { useTaskStore } from "../store/calendar-store";
import { getTasksForDate } from "../selectors/get-tasks-for-date";
import { toDateKey } from "../utils/date-utils";
import CalendarHeader from "./CalendarHeader";
import HourlyView from "./HourlyView";
import MonthView from "./MonthView";

/** Root calendar component. Manages view mode, date navigation, and task store wiring. */
export default function GoogleCalendarComponent() {
  const router = useRouter();

  // Granular selectors — Calendar only re-renders when these specific slices change
  const tasks       = useTaskStore((s) => s.tasks);
  const addTask     = useTaskStore((s) => s.addTask);
  const moveTask    = useTaskStore((s) => s.moveTask);
  const selectedDateKey    = useTaskStore((s) => s.selectedDate);
  const setSelectedDateKey = useTaskStore((s) => s.setSelectedDate);
  const viewMode    = useTaskStore((s) => s.viewMode);
  const setViewMode = useTaskStore((s) => s.setViewMode);

  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // Hoisted draft/drag states
  const [draftStart, setDraftStart] = useState<number | null>(null);
  const [draftEnd, setDraftEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedDate = useMemo(
    () => new Date(selectedDateKey + "T00:00:00"),
    [selectedDateKey],
  );

  const setSelectedDate = useCallback((date: Date) => {
    setSelectedDateKey(toDateKey(date));
  }, [setSelectedDateKey]);

  // Month navigation
  const handlePrevMonth = useCallback(() => {
    setDraftStart(null);
    setDraftEnd(null);
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDraftStart(null);
    setDraftEnd(null);
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (draftStart !== null) {
        setDraftStart(null);
        setDraftEnd(null);
        return true;
      }
      if (viewMode === "day") {
        setViewMode("month");
        // Reset currentDate to match selected date's month
        setCurrentDate(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
        );
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [viewMode, selectedDate, setViewMode, draftStart]);

  const handleSelectToday = () => {
    setDraftStart(null);
    setDraftEnd(null);
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
    setViewMode("day");
  };

  const handleDaySelect = (date: Date) => {
    setDraftStart(null);
    setDraftEnd(null);
    setSelectedDate(date);
    setViewMode("day");
  };

  // Filter tasks for the selected day (for hourly view)
  const dayTasks = useMemo(
    () => getTasksForDate(tasks, selectedDate),
    [tasks, selectedDateKey], // selectedDateKey is stable string, avoids Date ref churn
  );

  const carriedForwardTasks = useMemo(() => {
    const todayStr = toDateKey(new Date());
    if (selectedDateKey < todayStr) return [];
    return tasks.filter(
      (t) => t.date < selectedDateKey && t.status !== "COMPLETED",
    );
  }, [tasks, selectedDateKey]);

  const handleAddTask = useCallback((task: Omit<typeof tasks[0], "id" | "color">) => {
    addTask(task);
  }, [addTask]);

  const handleMoveTask = useCallback((id: string, newStart: number, newEnd: number) => {
    moveTask(id, newStart, newEnd);
  }, [moveTask]);

  return (
    <SafeAreaView className="flex-1 bg-[#051424]" edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: viewMode === "month",
        }}
      />

      {/* Header */}
      <CalendarHeader
        currentMonthName={months[currentDate.getMonth()]}
        currentYear={currentDate.getFullYear()}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSelectToday={handleSelectToday}
        onBackPress={
          viewMode === "day" ? () => {
            setDraftStart(null);
            setDraftEnd(null);
            setViewMode("month");
          } : undefined
        }
        onTasksPress={() => {
          setDraftStart(null);
          setDraftEnd(null);
          router.push("/tasks");
        }}
      />

      {/* View Toggle */}
      {viewMode === "month" ? (
        <MonthView
          currentDate={currentDate}
          tasks={tasks}
          onDaySelect={handleDaySelect}
        />
      ) : (
        <HourlyView
          selectedDate={selectedDate}
          tasks={dayTasks}
          carriedForwardTasks={carriedForwardTasks}
          onAddTask={handleAddTask}
          onMoveTask={handleMoveTask}
          onDeleteTask={() => {}}
          draftStart={draftStart}
          setDraftStart={setDraftStart}
          draftEnd={draftEnd}
          setDraftEnd={setDraftEnd}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      )}

      {/* FAB — only in day view when no draft active */}
      {viewMode === "day" && draftStart === null && (
        <Pressable
          onPress={() => {
            const now = new Date();
            const currentHour = now.getHours();
            setDraftStart(currentHour);
            setDraftEnd(Math.min(24, currentHour + 2));
          }}
          className="absolute bottom-6 right-6 w-14 h-14 bg-[#f59e0b] rounded-[20px] items-center justify-center z-[40] shadow-lg shadow-black/40"
        >
          <Ionicons name="add" size={32} color="#051424" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}
