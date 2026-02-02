import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { registryService } from '../../api/services/registryService';
import { queryKeys } from '../../lib/queryKeys';
import type { RegistryDateFilter, RegistryQueryParams } from '../../api/types';

export interface RegistryEntryView {
  id: string;
  points: number;
  completedAt: Date;
  choreId: string;
  choreName: string;
  chorePoints: number;
  categoryName: string;
  userId: string;
  userName: string;
  userPhotoURL: string | undefined;
}

export function useRegistryQuery(
  householdId: string | null,
  params?: RegistryQueryParams
) {
  return useQuery({
    queryKey: queryKeys.registry.list(householdId || '', params),
    queryFn: () => registryService.getRegistry(householdId!, params),
    enabled: !!householdId,
  });
}

export function useRegistryForUserQuery(
  householdId: string | null,
  userId: string | null
) {
  return useQuery({
    queryKey: queryKeys.registry.list(householdId || '', { userId: userId || undefined }),
    queryFn: () => registryService.getRegistry(householdId!, { userId: userId! }),
    enabled: !!householdId && !!userId,
  });
}

// Enhanced view hook with transformation
export function useRegistryViewQuery(
  householdId: string | null,
  filter: RegistryDateFilter
) {
  const queryResult = useQuery({
    queryKey: queryKeys.registry.list(householdId || '', { filter, limit: 50 }),
    queryFn: () => registryService.getRegistry(householdId!, { filter, limit: 50 }),
    enabled: !!householdId,
  });

  // Transform data to RegistryEntryView format
  const transformedData = useMemo(() => {
    if (!queryResult.data) return [];

    return queryResult.data.map((entry) => ({
      id: entry.id,
      points: entry.times,
      completedAt: new Date(entry.completedAt),
      choreId: entry.choreId,
      choreName: entry.choreName,
      chorePoints: entry.times,
      categoryName: "", // TODO: Backend doesn't provide categoryName
      userId: entry.userId,
      userName: entry.userName,
      userPhotoURL: undefined, // TODO: Backend doesn't provide photoURL
    }));
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: transformedData,
  };
}
