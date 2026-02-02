import { useMutation, useQueryClient } from '@tanstack/react-query';
import { choresService } from '../../api/services/choresService';
import { queryKeys } from '../../lib/queryKeys';
import type { CreateChoreDto, UpdateChoreDto } from '../../api/types';

export function useCreateChoreMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChoreDto) =>
      choresService.createChore(householdId, data),
    onSuccess: () => {
      // Invalidate chores list
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.list(householdId)
      });
    },
  });
}

export function useUpdateChoreMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChoreDto }) =>
      choresService.updateChore(householdId, id, data),
    onSuccess: (_data, variables) => {
      // Invalidate specific chore and list
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.detail(householdId, variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.list(householdId)
      });
    },
  });
}

export function useDeleteChoreMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      choresService.deleteChore(householdId, id),
    onSuccess: () => {
      // Invalidate chores list
      queryClient.invalidateQueries({
        queryKey: queryKeys.chores.list(householdId)
      });
    },
  });
}
