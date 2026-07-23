export interface UpsertGoalInput {
  userId: string;
  fiveYearGoal?: string | null;
  oneYearGoal?: string | null;
  monthlyGoal?: string | null;
  pathCommitment?: string | null;
}
