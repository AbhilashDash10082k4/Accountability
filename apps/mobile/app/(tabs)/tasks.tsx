import React from "react";
import { Stack } from "expo-router";
import TasksScreen from "@/features/tasks/TasksScreen";

export default function TasksTab() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TasksScreen />
    </>
  );
}
