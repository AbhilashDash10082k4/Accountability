import { TimelineEvent } from "../lib/utils/interfaces";

export const mockEvents: TimelineEvent[] = [
  // May 25 Events
  {
    id: "mock-may-25-1",
    title: "Outing",
    time: "18:00",
    type: "device",
  },
  {
    id: "mock-may-25-2",
    title: "Coding",
    time: "19:00",
    type: "device",
  },
  {
    id: "mock-may-25-3",
    title: "Tv",
    time: "20:00",
    type: "device",
  },
  {
    id: "mock-may-25-4",
    title: "Dinner, chess",
    time: "21:00",
    type: "device",
  },
  {
    id: "mock-may-25-5",
    title: "Code-tried to debug but wasnt success",
    time: "23:00",
    type: "completed",
    iconName: "check-circle",
  },
  // May 26 Events
  {
    id: "mock-may-26-1",
    title: "Mrng routin",
    time: "08:00",
    type: "habit",
    iconName: "meditation",
  },
  {
    id: "mock-may-26-2",
    title: "Due: App",
    time: "10:00",
    type: "deadline",
  },
  {
    id: "mock-may-26-3",
    title: "Due: Cod",
    time: "10:30",
    type: "deadline",
  },
  {
    id: "mock-may-26-4",
    title: "Stage32 Did",
    time: "12:00",
    type: "habit",
    iconName: "shield-star",
  },
  {
    id: "mock-may-26-5",
    title: "Sleep",
    time: "23:00",
    type: "device",
  },
  // May 28 Events
  {
    id: "mock-may-28-1",
    title: "Bakrid",
    time: "10:00",
    type: "habit",
  },
  // May 29 Events
  {
    id: "mock-may-29-1",
    title: "Bus to Bhub",
    time: "08:00",
    type: "device",
  },
  {
    id: "mock-may-29-2",
    title: "Bus to Bhub",
    time: "09:00",
    type: "device",
  },
  // May 1 Events
  {
    id: "mock-may-1-1",
    title: "Buddha Pur",
    time: "09:00",
    type: "habit",
  },
];
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
