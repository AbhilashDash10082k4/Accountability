import { TaskStatus } from "@/store/prisma/generated/enums";
import { prisma } from "@/store/prisma/client";
import { CreateTaskInput } from "./task.type";

export class TaskRepository {
  async createTask(data: CreateTaskInput) {
    const dataCreated = await prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.PENDING,
        activityLogs: {
          create: { action: "TASK_CREATED" },
        },
      },
    });
    return dataCreated;
  }

  async getTasksByUserId(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
    });
  }
}
