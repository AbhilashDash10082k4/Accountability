import { z } from "zod";

export const upsertGoalValidator = z.object({
  userId: z.string().uuid(),
  fiveYearGoal: z.string().optional().nullable(),
  oneYearGoal: z.string().optional().nullable(),
  monthlyGoal: z.string().optional().nullable(),
  pathCommitment: z.string().optional().nullable(),
});
