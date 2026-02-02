import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../../api/services/categoriesService';
import { queryKeys } from '../../lib/queryKeys';
import type { CreateCategoryDto, UpdateCategoryDto } from '../../api/types';

export function useCreateCategoryMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      categoriesService.createCategory(householdId, data),
    onSuccess: () => {
      // Invalidate categories list for this household
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.list(householdId)
      });
      // Invalidate chores since they reference categories
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.list(householdId)
      });
    },
  });
}

export function useUpdateCategoryMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesService.updateCategory(householdId, id, data),
    onSuccess: (_data, variables) => {
      // Invalidate specific category and list
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(householdId, variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.list(householdId)
      });
      // Invalidate chores to update categoryName
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.list(householdId)
      });
    },
  });
}

export function useDeleteCategoryMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      categoriesService.deleteCategory(householdId, id),
    onSuccess: () => {
      // Invalidate all category-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.list(householdId)
      });
      // Invalidate chores since they may have lost their category
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.list(householdId)
      });
    },
  });
}
