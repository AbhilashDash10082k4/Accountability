import React from "react";
import { Stack } from "expo-router";
import GoogleCalendarComponent from "../components/Calendar/Calendar";

export default function CalendarScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GoogleCalendarComponent />
    </>
  );
}

