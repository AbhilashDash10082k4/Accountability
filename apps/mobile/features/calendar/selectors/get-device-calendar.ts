import { Task } from "@/lib/interfaces";
import { toDateKey } from "../utils/date-utils";
import * as ExpoCalendar from "expo-calendar";

interface Props {
  currentDate: Date;
}

/** Fetch device calendar events and convert to Task shape.
 * Returns array of device Tasks. Caller responsible for merging into store. */
export default async function getDeviceCalendar({
  currentDate,
}: Props): Promise<Task[]> {
  try {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== "granted") return [];

    const calendars = await ExpoCalendar.getCalendarsAsync(
      ExpoCalendar.EntityTypes.EVENT,
    );
    const calendarIds = calendars.map((cal) => cal.id);
    if (calendarIds.length === 0) return [];

    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      0,
      23,
      59,
      59,
    );

    const fetchedEvents = await ExpoCalendar.getEventsAsync(
      calendarIds,
      start,
      end,
    );

    return fetchedEvents.map((evt) => {
      const startDate = new Date(evt.startDate);
      const endDate = evt.endDate
        ? new Date(evt.endDate)
        : new Date(startDate.getTime() + 3600000);
      const startFloat = startDate.getHours() + startDate.getMinutes() / 60;
      const endFloat = endDate.getHours() + endDate.getMinutes() / 60;

      return {
        id: evt.id,
        title: evt.title,
        description: evt.notes || "",
        startTime: startFloat,
        endTime: endFloat || startFloat + 1,
        date: toDateKey(startDate),
        color: "#64B5F6",
        type: "device" as const,
        status: "COMPLETED" as const,
      };
    });
  } catch (err) {
    console.warn("Failed to load device events:", err);
    return [];
  }
}
