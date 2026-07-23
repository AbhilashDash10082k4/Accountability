export interface CreateTaskInput {
  title: string;
  description: string;
  durationMins: number;
  startTime: Date;
  endTime: Date;
  userId: string;
  aimId?: string;
}
export interface CreateTaskResponse {
  id: string;
  title: string;
  description: string;
  durationMins: number;
}
export interface CreateFocusSession {
  title: string;
  startTime: Date;
  endTime: Date;
  userId: string;
}
