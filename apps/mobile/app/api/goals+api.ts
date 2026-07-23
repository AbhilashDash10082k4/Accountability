import { GetGoalService, UpsertGoalService } from "@/features/goals/goals-service";
import { upsertGoalValidator } from "@/features/goals/goals.validator";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ msg: "Missing userId", status: 400 });
    }

    const goalService = new GetGoalService();
    const goal = await goalService.execute(userId);

    return Response.json({ msg: "success", data: goal, status: 200 });
  } catch (error) {
    return Response.json({ msg: "Failed", data: error, status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedGoal = upsertGoalValidator.parse(body);

    const goalService = new UpsertGoalService();
    const goal = await goalService.execute(validatedGoal);

    return Response.json({ msg: "success", data: goal, status: 201 });
  } catch (error) {
    return Response.json({ msg: "Failed", data: error, status: 500 });
  }
}
