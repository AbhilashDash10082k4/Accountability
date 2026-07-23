/** Task creation utilities */

const TASK_COLORS = [
  "#4FC3F7", // sky blue
  "#81C784", // green
  "#FFB74D", // orange
  "#BA68C8", // purple
  "#4DB6AC", // teal
  "#FF8A65", // coral
  "#64B5F6", // blue
  "#AED581", // lime
  "#F06292", // pink
  "#FFD54F", // amber
];

/** Pick random color from curated palette */
export const generateTaskColor = (): string =>
  TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];

/** Generate unique task ID */
export const generateTaskId = (): string => `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
