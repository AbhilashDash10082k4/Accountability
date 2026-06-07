/*Function of this component-
-show calendar UI with months and days
-every day should be pressable button opening a different view
-every day should be divided into hours with a task setter
-task setter should be variable and upon setting the tasks the popup should be visible
-should be able to navigate back and forth the months
-should save tasks in the calendar/DB and show them in the tasks tab*/
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ExpoCalendar from "expo-calendar";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";

import { mockEvents, monthNames } from "@/constants/mockEvents";
import { TimelineEvent } from "@/lib/interfaces";
import CalendarHeader from "./CalendarHeader";
import HourlyView from "./HourlyView";
import MonthView from "./MonthView";

export default function GoogleCalendarComponent() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"month" | "day">("month");

  // Set default initial date to present day
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      console.log("\nPREV:", prev.toString());
      const prevv = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      console.log("\nNEXT:", prevv.toString());
      return prevv;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  }, []);
  useEffect(() => {
    console.log(
      "\nVIEW:",
      viewMode,
      "\nCURRENT:",
      currentDate.toString(),
      "\nSELECTED:",
      selectedDate.toString(),
    );
  }, [viewMode, currentDate, selectedDate]);
  // useEffect(() => {
  //   const onBackPress = () => {
  //     if (viewMode === "day") {
  //       setViewMode("month");
  //       setCurrentDate(
  //         new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  //       );
  //       return true;
  //     }
  //     if (viewMode === "month") {
  //       return false;
  //     }
  //     return false;
  //   };
  //   const subscription = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     onBackPress,
  //   );
  //   return () => subscription.remove();
  // }, [viewMode, handlePrevMonth, selectedDate]);

  const [events, setEvents] = useState<TimelineEvent[]>(mockEvents);

  // Load actual calendar events on mount if permissions granted
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
        if (status === "granted") {
          const calendars = await ExpoCalendar.getCalendarsAsync(
            ExpoCalendar.EntityTypes.EVENT,
          );
          const calendarIds = calendars.map((cal) => cal.id);

          if (calendarIds.length > 0) {
            const start = new Date(2026, 4, 1);
            const end = new Date(2026, 5, 0); // End of May

            const fetchedEvents = await ExpoCalendar.getEventsAsync(
              calendarIds,
              start,
              end,
            );

            const mapped: TimelineEvent[] = fetchedEvents.map((evt) => {
              const startDate = new Date(evt.startDate);
              const hours = String(startDate.getHours()).padStart(2, "0");
              const minutes = String(startDate.getMinutes()).padStart(2, "0");
              return {
                id: evt.id,
                title: evt.title,
                time: `${hours}:${minutes}`,
                description: evt.notes || "Device Event",
                location: evt.location || undefined,
                type: "device",
                iconName: "calendar-clock",
              };
            });

            setEvents((prev) => [...mapped, ...prev]);
          }
        }
      } catch (err) {
        console.warn("Failed to load device events:", err);
      }
    })();
  }, []);

  const handleSelectToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setViewMode("day");
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setViewMode("day");
  };

  const handleEventMove = (eventId: string, newTime: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, time: newTime } : evt)),
    );
  };

  const handleAddEvent = () => {
    // Adds a quick mock event for testing
    const newEvent: TimelineEvent = {
      id: `custom-${Date.now()}`,
      title: "New Custom Event",
      time: "15:00",
      type: "deep-work",
      iconName: "shield-star",
      description: "Tap and hold to drag and reschedule me!",
    };
    setEvents((prev) => [newEvent, ...prev]);
    setViewMode("day");
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: viewMode === "month",
        }}
      />
      {/* Calendar Header component */}
      <CalendarHeader
        currentMonthName={monthNames[currentDate.getMonth()]}
        currentYear={currentDate.getFullYear()}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSelectToday={handleSelectToday}
        onBackPress={
          viewMode === "day" ? () => setViewMode("month") : undefined
        }
        onTasksPress={() => router.push("/todo")}
      />

      {/* Main Mode Toggle Switch */}
      {viewMode === "month" ? (
        <View>
          <Text>Month View Test</Text>
        </View>
      ) : (
        <HourlyView
          selectedDate={selectedDate}
          events={events}
          onEventMove={handleEventMove}
          onAddEvent={(newEvent) => setEvents((prev) => [newEvent, ...prev])}
        />
      )}

      {/* Floating Add Action Button */}
      <Pressable
        onPress={handleAddEvent}
        className="absolute bottom-24 right-6 w-14 h-14 bg-amber-500 rounded-[20px] shadow-2xl items-center justify-center z-40 active:scale-95 shadow-black/40"
      >
        <Ionicons name="add" size={32} color="#051424" />
      </Pressable>

      {/* Bottom Navigation tab bar */}
      <View className="absolute bottom-0 left-0 w-full z-50 rounded-t-xl border-t h-20 px-4 flex-row justify-around items-center bg-background/60 border-t-white/10">
        <BlurView
          tint="dark"
          intensity={100}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />

        <Pressable
          onPress={() => router.push("/")}
          className="items-center justify-center w-16 h-12 active:opacity-75"
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Home
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setViewMode("month")}
          className="items-center justify-center w-16 h-12 active:opacity-75"
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={24}
            color={
              viewMode === "month" ? "#44e2cd" : "rgba(255, 255, 255, 0.4)"
            }
          />
          <Text
            className={`text-[10px] font-semibold mt-1 font-geist ${viewMode === "month" ? "text-secondary" : "text-on-surface-variant/40"}`}
          >
            Habits
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/todo")}
          className="items-center justify-center w-16 h-12 scale-110 active:opacity-75"
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Tasks
          </Text>
        </Pressable>

        <Pressable className="items-center justify-center w-16 h-12 active:opacity-75">
          <MaterialCommunityIcons
            name="handshake-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Partners
          </Text>
        </Pressable>

        <Pressable className="items-center justify-center w-16 h-12 active:opacity-75">
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color="rgba(255, 255, 255, 0.4)"
          />
          <Text className="text-[10px] font-semibold text-on-surface-variant/40 mt-1 font-geist">
            Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
