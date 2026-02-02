import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registryService } from '../../api/services/registryService';
import { queryKeys } from '../../lib/queryKeys';
import type { CreateRegistryEntryDto, BatchRegistryDto } from '../../api/types';

export function useCreateRegistryEntryMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegistryEntryDto) =>
      registryService.createRegistryEntry(householdId, data),
    onSuccess: () => {
      // Invalidate all registry queries for this household
      queryClient.invalidateQueries({
        queryKey: queryKeys.registry.lists()
      });
    },
  });
}

export function useCreateBatchRegistryMutation(householdId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchRegistryDto) =>
      registryService.createBatchRegistry(householdId, data),
    onSuccess: () => {
      // Invalidate all registry queries for this household
      queryClient.invalidateQueries({
        queryKey: queryKeys.registry.lists()
      });
    },
  });
}
