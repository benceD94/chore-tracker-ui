import { householdsService } from "../api/services/householdsService";

export async function createHousehold(name: string) {
  const household = await householdsService.createHousehold({ name });
  // Backend auto-creates default categories and chores
  // Backend automatically adds current user as member based on auth token
  return household.id;
}

export async function updateHousehold(householdId: string, newName: string) {
  await householdsService.updateHousehold(householdId, { name: newName.trim() });
}

export async function addHouseholdMember(householdId: string, memberId: string) {
  await householdsService.addMember(householdId, memberId);
}
