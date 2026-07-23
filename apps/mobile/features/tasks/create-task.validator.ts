import { z } from "zod";
export const createTaskValidator = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  userId: z.string(),
  aimId: z.string().optional(),
});
export type TaskValidatorType = z.infer<typeof createTaskValidator>;
