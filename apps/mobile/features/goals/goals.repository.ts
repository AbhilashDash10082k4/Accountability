import { prisma } from "@/store/prisma/client";
import { UpsertGoalInput } from "./goals.type";

export class GoalsRepository {
  async getGoalByUserId(userId: string) {
    return prisma.userGoal.findUnique({
      where: { userId },
    });
  }

  async upsertGoal(data: UpsertGoalInput) {
    return prisma.userGoal.upsert({
      where: { userId: data.userId },
      update: {
        fiveYearGoal: data.fiveYearGoal,
        oneYearGoal: data.oneYearGoal,
        monthlyGoal: data.monthlyGoal,
        pathCommitment: data.pathCommitment,
      },
      create: {
        userId: data.userId,
        fiveYearGoal: data.fiveYearGoal,
        oneYearGoal: data.oneYearGoal,
        monthlyGoal: data.monthlyGoal,
        pathCommitment: data.pathCommitment,
      },
    });
  }
}
