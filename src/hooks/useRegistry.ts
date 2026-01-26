import { useFetch } from "./useFetch";
import { registryService } from "../api/services/registryService";
import type { RegistryResponseDto, RegistryDateFilter } from "../api/types";

// Re-export for backward compatibility
export type { RegistryDateFilter } from "../api/types";

// View type for registry entries (will be updated when backend returns denormalized data)
export type RegistryEntryView = {
  id: string;
  points: number;
  completedAt: Date | null;
  choreId: string;
  choreName: string;
  chorePoints: number;
  categoryName: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
};

export function useRegistry(householdId: string | null) {
  return useFetch<RegistryResponseDto[]>(
    householdId ? () => registryService.getRegistry(householdId) : null,
    [householdId]
  );
}

export function useRegistryForUser(
  householdId: string | null,
  userId: string | null
) {
  if (!householdId || !userId) {
    return { data: null, loading: false, error: null, refetch: async () => {} };
  }

  return useFetch<RegistryResponseDto[]>(
    () => registryService.getRegistry(householdId, { userId }),
    [householdId, userId]
  );
}

export function useRegistryView(
  householdId: string | null,
  filter: RegistryDateFilter
) {
  const result = useFetch<RegistryResponseDto[]>(
    householdId
      ? () => registryService.getRegistry(householdId, { filter, limit: 50 })
      : null,
    [householdId, filter]
  );

  // Transform RegistryResponseDto to RegistryEntryView
  // Backend now provides denormalized choreName and userName
  const entries: RegistryEntryView[] = (result.data || []).map((entry) => ({
    id: entry.id,
    points: entry.times,
    completedAt: new Date(entry.completedAt),
    choreId: entry.choreId,
    choreName: entry.choreName,
    chorePoints: entry.times,
    categoryName: "", // TODO: Backend doesn't provide categoryName in registry
    userId: entry.userId,
    userName: entry.userName,
    userPhotoURL: undefined, // TODO: Backend doesn't provide photoURL in registry
  }));

  return {
    entries,
    loading: result.loading,
    error: result.error,
  };
}
