import { categoriesService } from "../api/services/categoriesService";

export async function createCategory(householdId: string, name: string) {
  const category = await categoriesService.createCategory(householdId, {
    name: name.trim(),
  });
  return category.id;
}

export async function updateCategory(
  householdId: string,
  categoryId: string,
  newName: string
) {
  await categoriesService.updateCategory(householdId, categoryId, {
    name: newName.trim(),
  });
}

export async function deleteCategory(householdId: string, categoryId: string) {
  await categoriesService.deleteCategory(householdId, categoryId);
}

// loadDefaultCategories is no longer needed - backend creates defaults
