/** Calendar Task — mirrors Prisma Task model shape for local use.
 * startTime/endTime stored as hour floats (0-24) for easy position calc.
 * date stored as "YYYY-MM-DD" key for filtering. */
export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: number; // hour float, e.g. 9.5 = 9:30 AM
  endTime: number; // hour float, e.g. 11.0 = 11:00 AM
  date: string; // "YYYY-MM-DD"
  color: string; // hex color for task block
  type: "task" | "device";
  status: "PENDING" | "IN_PROGRESS" | "PROOF_PENDING" | "VERIFICATION_PENDING" | "COMPLETED" | "FAILED";
  proofType?: "text" | "image" | "video" | "url";
  proofData?: string;
  verifiedAt?: string;
}

// ---------- Component Props ----------

export interface CalendarHeaderProps {
  currentMonthName: string;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectToday: () => void;
  onBackPress?: () => void;
  onTasksPress: () => void;
}

export interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onDaySelect: (date: Date) => void;
}

export interface HourlyViewProps {
  selectedDate: Date;
  tasks: Task[]; // already filtered for this day
  carriedForwardTasks?: Task[]; // pending tasks from previous days
  onAddTask: (task: Omit<Task, "id" | "color">) => void;
  onMoveTask: (id: string, newStart: number, newEnd: number) => void;
  onDeleteTask: (id: string) => void;
  draftStart: number | null;
  setDraftStart: (val: number | null) => void;
  draftEnd: number | null;
  setDraftEnd: (val: number | null) => void;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
}

export interface DayColumnProps {
  selectedDate: Date;
  tasks: Task[];
  hourHeight: number;
  scrollEnabled: boolean;
  setScrollEnabled: (v: boolean) => void;
  /** Called when long-press+drag creates a new block. Opens popup. */
  onDraftCreate: (start: number, end: number) => void;
  draftStart: number | null;
  draftEnd: number | null;
  onDraftMove: (start: number, end: number) => void;
  onDragToggle: (isDragging: boolean) => void;
  onEventMove: (id: string, newStart: number, newEnd: number) => void;
}

export interface DraggableEventProps {
  event: Task;
  hourHeight: number;
  onDragEnd: (eventId: string, newStart: number, newEnd: number) => void;
  onDragToggle: (isDragging: boolean) => void;
}

export interface AddEventBottomSheetProps {
  visible: boolean;
  isDragging?: boolean;
  selectedDate: Date;
  startHour: number; // hour float
  endHour: number; // hour float
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    startHour: number,
    endHour: number,
  ) => void;
}

export interface TimePickerModalProps {
  visible: boolean;
  initialHour: number; // 1-12
  initialMinute: number; // 0-55 (step 5)
  initialPeriod: "AM" | "PM";
  onClose: () => void;
  onSelect: (hour: number, minute: number, period: "AM" | "PM") => void;
}
