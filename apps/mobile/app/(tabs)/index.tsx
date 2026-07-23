import React from "react";
import { Stack } from "expo-router";
import GoogleCalendarComponent from "@/features/calendar/CalendarScreen";

export default function CalendarHomeScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GoogleCalendarComponent />
    </>
  );
}
