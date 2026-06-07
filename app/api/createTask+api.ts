import { z } from "zod";

export async function POST(request: Request) {
  /*user gives i/p in the FE (title, description, duration set) -> BE catches it, stores in DB*/
  const body = await request.json();
  return Response.json({ body });
}
