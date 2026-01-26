import { choresService } from "../api/services/choresService";
import { registryService } from "../api/services/registryService";
import type { ChoreInput } from "../pages/Chores";

export async function createChore(householdId: string, value: ChoreInput) {
  const chore = await choresService.createChore(householdId, {
    name: value.name.trim(),
    categoryId: value.categoryId,
    description: value.categoryName, // Using categoryName as description temporarily
  });
  return chore.id;
}

export async function updateChore(
  householdId: string,
  choreId: string,
  value: ChoreInput
) {
  await choresService.updateChore(householdId, choreId, {
    name: value.name.trim(),
    categoryId: value.categoryId,
    description: value.categoryName, // Using categoryName as description temporarily
  });
}

export async function deleteChore(householdId: string, choreId: string) {
  await choresService.deleteChore(householdId, choreId);
}

export async function registerChoreDone(options: {
  householdId: string;
  choreId: string;
  userId: string;
  points: number;
}) {
  const { householdId, choreId, userId, points } = options;

  await registryService.createRegistryEntry(householdId, {
    choreId,
    userId,
    times: points, // Backend uses 'times' instead of 'points'
  });
}

export async function registerMultipleChoresDone(options: {
  householdId: string;
  userId: string;
  items: { choreId: string; points: number; times?: number }[];
}) {
  const { householdId, userId, items } = options;

  const chores = items.flatMap((item) => {
    const times = item.times ?? 1;
    return Array.from({ length: times }, () => ({
      choreId: item.choreId,
      userId,
      times: 1, 
    }));
  });

  await registryService.createBatchRegistry(householdId, { chores });
}
