import { FocusSessionRepository, CreateFocusSessionInput } from "./focus-session.repository";
import { CreateFocusSessionDTO, createFocusSessionSchema } from "./focus-session.validator";

export class CreateFocusSessionService {
  private repository = new FocusSessionRepository();

  async execute(dto: CreateFocusSessionDTO) {
    // Validate input
    const validatedData = createFocusSessionSchema.parse(dto);

    // Map to DB input
    const input: CreateFocusSessionInput = {
      ...validatedData,
      startTime: new Date(validatedData.startTime),
    };

    return this.repository.createFocusSession(input);
  }
}

export class GetActiveFocusSessionService {
  private repository = new FocusSessionRepository();

  async execute(userId: string) {
    return this.repository.getActiveSession(userId);
  }
}
