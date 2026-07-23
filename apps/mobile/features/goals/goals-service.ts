import { GoalsRepository } from "./goals.repository";
import { UpsertGoalInput } from "./goals.type";

export class GetGoalService {
  private repository = new GoalsRepository();
  
  async execute(userId: string) {
    return this.repository.getGoalByUserId(userId);
  }
}

export class UpsertGoalService {
  private repository = new GoalsRepository();
  
  async execute(input: UpsertGoalInput) {
    return this.repository.upsertGoal(input);
  }
}
