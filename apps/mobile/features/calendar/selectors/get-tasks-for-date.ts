import { Task } from "@/lib/interfaces";
import { toDateKey } from "../utils/date-utils";

/** Filter tasks matching a specific calendar date */
export const getTasksForDate = (tasks: Task[], date: Date): Task[] => {
  const key = toDateKey(date);
  return tasks.filter((task) => task.date === key);
};
