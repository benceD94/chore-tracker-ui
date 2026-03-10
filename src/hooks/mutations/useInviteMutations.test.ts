import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useCreateInviteMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
} from './useInviteMutations';
import { createTestQueryClient, createWrapper } from '../../test/utils';
import type { InviteResponseDto } from '../../api/types';

vi.mock('../../api/services/invitesService', () => ({
  invitesService: {
    createInvite: vi.fn(),
    acceptInvite: vi.fn(),
    rejectInvite: vi.fn(),
    getPendingInvites: vi.fn(),
    getUsers: vi.fn(),
  },
}));

import { invitesService } from '../../api/services/invitesService';

const mockInvite: InviteResponseDto = {
  id: 'invite1',
  fromUser: {
    id: 'user1',
    uid: 'user1',
    displayName: 'Test User',
    email: 'test@example.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  invitedUserIds: ['user2', 'user3'],
  householdId: 'household1',
  householdName: 'Test Household',
  createdAt: '2024-01-01',
};

describe('useCreateInviteMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an invite and invalidate pending invites', async () => {
    vi.mocked(invitesService.createInvite).mockResolvedValue(mockInvite);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateInviteMutation(), {
      wrapper: createWrapper(queryClient),
    });

    const inviteData = {
      invitedUserIds: ['user2', 'user3'],
      householdId: 'household1',
    };
    result.current.mutate(inviteData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invitesService.createInvite).toHaveBeenCalledWith(inviteData);
    expect(invitesService.createInvite).toHaveBeenCalledTimes(1);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['invites', 'pending'],
    });
  });

  it('should handle errors when creating invite fails', async () => {
    const error = new Error('Failed to create invite');
    vi.mocked(invitesService.createInvite).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateInviteMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({
      invitedUserIds: ['user2'],
      householdId: 'household1',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});

describe('useAcceptInviteMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept an invite and invalidate invites and households', async () => {
    vi.mocked(invitesService.acceptInvite).mockResolvedValue(undefined);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useAcceptInviteMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('invite1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invitesService.acceptInvite).toHaveBeenCalledWith('invite1');
    expect(invitesService.acceptInvite).toHaveBeenCalledTimes(1);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['invites', 'pending'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['households', 'list'],
    });
  });

  it('should handle errors when accepting invite fails', async () => {
    const error = new Error('Failed to accept invite');
    vi.mocked(invitesService.acceptInvite).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useAcceptInviteMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('invite1');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});

describe('useRejectInviteMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject an invite and invalidate pending invites', async () => {
    vi.mocked(invitesService.rejectInvite).mockResolvedValue(undefined);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useRejectInviteMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('invite1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invitesService.rejectInvite).toHaveBeenCalledWith('invite1');
    expect(invitesService.rejectInvite).toHaveBeenCalledTimes(1);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['invites', 'pending'],
    });
  });

  it('should handle errors when rejecting invite fails', async () => {
    const error = new Error('Failed to reject invite');
    vi.mocked(invitesService.rejectInvite).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useRejectInviteMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('invite1');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
