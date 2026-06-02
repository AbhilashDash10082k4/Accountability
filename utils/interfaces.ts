export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  duration?: string;
  description?: string;
  type: "habit" | "deadline" | "deep-work" | "completed" | "device" | "task";
  location?: string;
  iconName?: string;
  date?: string;
}

export interface CalendarHeaderProps {
  currentMonthName: string;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectToday: () => void;
  onBackPress?: () => void;
  onTasksPress: () => void;
}

export interface DraggableEventProps {
  event: TimelineEvent;
  hourHeight: number;
  onDragEnd: (eventId: string, newTime: string) => void;
  onDragToggle: (isDragging: boolean) => void;
}

export interface HourlyViewProps {
  selectedDate: Date;
  events: TimelineEvent[];
  onEventMove: (eventId: string, newTime: string) => void;
  onAddEvent?: (newEvent: TimelineEvent) => void;
}
export interface MonthViewProps {
  currentDate: Date;
  events: TimelineEvent[];
  onDaySelect: (date: Date) => void;
}
