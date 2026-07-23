import { createTaskValidator } from "@/features/tasks/create-task.validator";
import { CreateTaskService } from "@/features/tasks/task-service";
import { z } from "zod";

export async function POST(request: Request) {
  /*user gives i/p in the FE (title, description, duration set) -> BE catches it, stores in DB*/
  try {
    const body = await request.json();
    const validatedTask = createTaskValidator.parse(body);
    const newTask = new CreateTaskService();
    const task = await newTask.execute({
      title: validatedTask.title,
      description: validatedTask.description,
      startTime: new Date(validatedTask.startTime),
      endTime: new Date(validatedTask.endTime),
      userId: validatedTask.userId,
      aimId: validatedTask.aimId,
      durationMins:
        validatedTask.endTime.getHours() - validatedTask.startTime.getHours(),
    });
    return Response.json({ msg: "success", data: task, status: 201 });
  } catch (error) {
    return Response.json({ msg: "Failed", data: error, status: 500 });
  }
}
