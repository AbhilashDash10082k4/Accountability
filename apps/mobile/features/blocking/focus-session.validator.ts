import { z } from "zod";
import { FocusSessionStatus } from "@/store/prisma/generated/enums";

export const createFocusSessionSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  startTime: z.string().datetime(),
  status: z.nativeEnum(FocusSessionStatus),
  blockedApps: z.array(
    z.object({
      appName: z.string(),
      packageName: z.string(),
    })
  ),
});

export type CreateFocusSessionDTO = z.infer<typeof createFocusSessionSchema>;
