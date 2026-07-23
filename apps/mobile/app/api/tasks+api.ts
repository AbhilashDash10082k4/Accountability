import { GetTasksService } from "@/features/tasks/task-service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    
    if (!userId) {
      return Response.json({ msg: "Missing userId", status: 400 });
    }

    const taskService = new GetTasksService();
    const tasks = await taskService.execute(userId);

    return Response.json({ msg: "success", data: tasks, status: 200 });
  } catch (error) {
    return Response.json({ msg: "Failed", data: error, status: 500 });
  }
}
