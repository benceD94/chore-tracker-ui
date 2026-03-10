import { api } from '../client';
import type {
  CreateInviteDto,
  InviteResponseDto,
  UserResponseDto,
} from '../types';

export const invitesService = {
  createInvite: (data: CreateInviteDto): Promise<InviteResponseDto> => {
    return api.post<InviteResponseDto>('/invites', data);
  },

  getPendingInvites: (): Promise<InviteResponseDto[]> => {
    return api.get<InviteResponseDto[]>('/invites/pending');
  },

  acceptInvite: (inviteId: string): Promise<void> => {
    return api.post<void>(`/invites/${inviteId}/accept`);
  },

  rejectInvite: (inviteId: string): Promise<void> => {
    return api.post<void>(`/invites/${inviteId}/reject`);
  },

  getUsers: (): Promise<UserResponseDto[]> => {
    return api.get<UserResponseDto[]>('/users');
  },
};
