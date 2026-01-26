import { useFetch } from "./useFetch";
import { householdsService } from "../api/services/householdsService";
import type { HouseholdResponseDto } from "../api/types";

export function useHouseholds() {
  return useFetch<HouseholdResponseDto[]>(
    () => householdsService.getHouseholds(),
    []
  );
}
