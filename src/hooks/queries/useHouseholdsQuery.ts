import { useQuery } from '@tanstack/react-query';
import { householdsService } from '../../api/services/householdsService';
import { queryKeys } from '../../lib/queryKeys';

export function useHouseholdsQuery() {
  return useQuery({
    queryKey: queryKeys.households.list(),
    queryFn: () => householdsService.getHouseholds(),
  });
}

export function useHouseholdQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.households.detail(id || ''),
    queryFn: () => householdsService.getHousehold(id!),
    enabled: !!id,
  });
}
