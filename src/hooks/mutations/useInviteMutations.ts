import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitesService } from '../../api/services/invitesService';
import { queryKeys } from '../../lib/queryKeys';
import type { CreateInviteDto } from '../../api/types';

export function useCreateInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInviteDto) => invitesService.createInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invites.pending(),
      });
    },
  });
}

export function useAcceptInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => invitesService.acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invites.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.households.lists(),
      });
    },
  });
}

export function useRejectInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => invitesService.rejectInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invites.pending(),
      });
    },
  });
}
