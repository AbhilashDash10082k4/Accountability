import { CreateFocusSessionService } from "@/features/blocking/focus-session.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const service = new CreateFocusSessionService();
    const session = await service.execute(body);

    return Response.json({ success: true, data: session });
  } catch (error: any) {
    console.error("FocusSession POST Error:", error);
    return Response.json(
      { success: false, error: error.message || "Failed to create focus session" },
      { status: 400 }
    );
  }
}
