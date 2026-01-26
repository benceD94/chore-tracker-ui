import { useFetch } from "./useFetch";
import { categoriesService } from "../api/services/categoriesService";
import type { CategoryResponseDto } from "../api/types";

export function useCategories(householdId: string | null) {
  return useFetch<CategoryResponseDto[]>(
    householdId ? () => categoriesService.getCategories(householdId) : null,
    [householdId]
  );
}
