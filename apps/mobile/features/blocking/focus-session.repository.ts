import { prisma } from "@/store/prisma/client";
import { FocusSessionStatus } from "@/store/prisma/generated/enums";

export interface CreateFocusSessionInput {
  userId: string;
  title: string;
  startTime: Date;
  status: FocusSessionStatus;
  blockedApps: { appName: string; packageName: string }[];
}

export class FocusSessionRepository {
  async createFocusSession(data: CreateFocusSessionInput) {
    return prisma.focusSession.create({
      data: {
        userId: data.userId,
        title: data.title,
        startTime: data.startTime,
        status: data.status,
        blockedApps: {
          create: data.blockedApps,
        },
      },
    });
  }

  async getActiveSession(userId: string) {
    return prisma.focusSession.findFirst({
      where: {
        userId,
        status: FocusSessionStatus.ACTIVE,
      },
      include: {
        blockedApps: true,
      },
    });
  }
}
