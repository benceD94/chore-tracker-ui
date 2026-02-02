import { useQuery } from '@tanstack/react-query';
import { choresService } from '../../api/services/choresService';
import { queryKeys } from '../../lib/queryKeys';

export function useChoresQuery(householdId: string | null) {
  return useQuery({
    queryKey: queryKeys.chores.list(householdId || ''),
    queryFn: () => choresService.getChores(householdId!),
    enabled: !!householdId,
  });
}

export function useChoreQuery(householdId: string | null, choreId: string | null) {
  return useQuery({
    queryKey: queryKeys.chores.detail(householdId || '', choreId || ''),
    queryFn: () => choresService.getChore(householdId!, choreId!),
    enabled: !!householdId && !!choreId,
  });
}
