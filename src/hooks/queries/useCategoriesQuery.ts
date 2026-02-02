import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../../api/services/categoriesService';
import { queryKeys } from '../../lib/queryKeys';

export function useCategoriesQuery(householdId: string | null) {
  return useQuery({
    queryKey: queryKeys.categories.list(householdId || ''),
    queryFn: () => categoriesService.getCategories(householdId!),
    enabled: !!householdId,
  });
}

export function useCategoryQuery(householdId: string | null, categoryId: string | null) {
  return useQuery({
    queryKey: queryKeys.categories.detail(householdId || '', categoryId || ''),
    queryFn: () => categoriesService.getCategory(householdId!, categoryId!),
    enabled: !!householdId && !!categoryId,
  });
}
