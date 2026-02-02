import { useMutation, useQueryClient } from '@tanstack/react-query';
import { householdsService } from '../../api/services/householdsService';
import { queryKeys } from '../../lib/queryKeys';
import type { CreateHouseholdDto, UpdateHouseholdDto } from '../../api/types';

export function useCreateHouseholdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHouseholdDto) =>
      householdsService.createHousehold(data),
    onSuccess: () => {
      // Invalidate households list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.households.lists()
      });
    },
  });
}

export function useUpdateHouseholdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHouseholdDto }) =>
      householdsService.updateHousehold(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate specific household and list
      queryClient.invalidateQueries({
        queryKey: queryKeys.households.detail(variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.households.lists()
      });
    },
  });
}

export function useAddHouseholdMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ householdId, userId }: { householdId: string; userId: string }) =>
      householdsService.addMember(householdId, userId),
    onSuccess: (_data, variables) => {
      // Invalidate household details to show new member
      queryClient.invalidateQueries({
        queryKey: queryKeys.households.detail(variables.householdId)
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.households.lists()
      });
    },
  });
}
