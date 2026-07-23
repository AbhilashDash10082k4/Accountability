/** Pure date utility functions for calendar feature */

/** Convert Date to "YYYY-MM-DD" key string */
export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Check if two dates are the same calendar day */
export const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

/** Format hour number to label: 0→"12 AM", 13→"1 PM" */
export const formatHourLabel = (h: number): string => {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
};

/** Convert hour float to readable time: 9.5→"9:30 AM", 13.25→"1:15 PM" */
export const hourFloatToTimeStr = (hourFloat: number): string => {
  const h = Math.floor(hourFloat);
  const m = Math.round((hourFloat - h) * 60);
  const period = h < 12 || h === 24 ? "AM" : "PM";
  const displayHour = h === 0 || h === 24 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
};

/** Convert 12h components to hour float: (9, 30, "AM")→9.5, (1, 15, "PM")→13.25 */
export const timeComponentsToFloat = (
  hour: number,
  minute: number,
  period: "AM" | "PM",
): number => {
  let h = hour;
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h < 12) h += 12;
  return h + minute / 60;
};

/** Convert hour float to 12h components: 13.5→{hour:1, minute:30, period:"PM"} */
export const floatToTimeComponents = (
  hourFloat: number,
): { hour: number; minute: number; period: "AM" | "PM" } => {
  const h24 = Math.floor(hourFloat);
  const minute = Math.round((hourFloat - h24) * 60);
  const period: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return { hour, minute, period };
};
