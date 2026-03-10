import { useQuery } from '@tanstack/react-query';
import { invitesService } from '../../api/services/invitesService';
import { queryKeys } from '../../lib/queryKeys';

export function usePendingInvitesQuery() {
  return useQuery({
    queryKey: queryKeys.invites.pending(),
    queryFn: () => invitesService.getPendingInvites(),
  });
}

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => invitesService.getUsers(),
  });
}
