import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePendingInvitesQuery, useUsersQuery } from './useInvitesQuery';
import { createTestQueryClient, createWrapper } from '../../test/utils';
import type { InviteResponseDto, UserResponseDto } from '../../api/types';

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

describe('usePendingInvitesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch pending invites', async () => {
    const mockInvites: InviteResponseDto[] = [
      {
        id: 'invite1',
        fromUser: {
          id: 'user1',
          uid: 'user1',
          displayName: 'Alice',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        invitedUserIds: ['user2'],
        householdId: 'household1',
        householdName: 'Alice House',
        createdAt: '2024-01-01',
      },
    ];

    vi.mocked(invitesService.getPendingInvites).mockResolvedValue(mockInvites);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => usePendingInvitesQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockInvites);
    expect(invitesService.getPendingInvites).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching pending invites fails', async () => {
    const error = new Error('Failed to fetch invites');
    vi.mocked(invitesService.getPendingInvites).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => usePendingInvitesQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});

describe('useUsersQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users list', async () => {
    const mockUsers: UserResponseDto[] = [
      {
        id: 'user1',
        uid: 'user1',
        displayName: 'Alice',
        email: 'alice@example.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'user2',
        uid: 'user2',
        displayName: 'Bob',
        email: 'bob@example.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    vi.mocked(invitesService.getUsers).mockResolvedValue(mockUsers);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUsersQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUsers);
    expect(invitesService.getUsers).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching users fails', async () => {
    const error = new Error('Failed to fetch users');
    vi.mocked(invitesService.getUsers).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUsersQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
