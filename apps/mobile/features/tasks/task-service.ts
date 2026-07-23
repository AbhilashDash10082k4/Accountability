import { TaskRepository } from "./task.repository";
import { CreateTaskInput } from "./task.type";

/*Create task
Update task
Delete task
Fetch tasks*/
export class CreateTaskService {
  private taskRepository = new TaskRepository();
  async execute(ip: CreateTaskInput) {
    return this.taskRepository.createTask(ip);
  }
}

export class GetTasksService {
  private taskRepository = new TaskRepository();
  async execute(userId: string) {
    return this.taskRepository.getTasksByUserId(userId);
  }
}
