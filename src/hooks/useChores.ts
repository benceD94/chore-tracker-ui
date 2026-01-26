import { useFetch } from "./useFetch";
import { choresService } from "../api/services/choresService";
import type { ChoreResponseDto } from "../api/types";

export function useChores(householdId: string | null) {
  return useFetch<ChoreResponseDto[]>(
    householdId ? () => choresService.getChores(householdId) : null,
    [householdId]
  );
}
