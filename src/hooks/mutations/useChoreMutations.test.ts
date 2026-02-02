import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useCreateChoreMutation,
  useUpdateChoreMutation,
  useDeleteChoreMutation,
} from './useChoreMutations';
import { createTestQueryClient, createWrapper } from '../../test/utils';
import type { ChoreResponseDto } from '../../api/types';

vi.mock('../../api/services/choresService', () => ({
  choresService: {
    createChore: vi.fn(),
    updateChore: vi.fn(),
    deleteChore: vi.fn(),
  },
}));

import { choresService } from '../../api/services/choresService';

describe('useCreateChoreMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a chore and invalidate chores list', async () => {
    const mockChore: ChoreResponseDto = {
      id: '1',
      name: 'Wash dishes',
      points: 5,
      householdId: 'household1',
      categoryId: 'cat1',
      categoryName: 'Kitchen',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(choresService.createChore).mockResolvedValue(mockChore);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateChoreMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    const newChoreData = {
      name: 'Wash dishes',
      points: 5,
      categoryId: 'cat1',
    };
    result.current.mutate(newChoreData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(choresService.createChore).toHaveBeenCalledWith('household1', newChoreData);
    expect(choresService.createChore).toHaveBeenCalledTimes(1);

    // Verify query invalidation
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'list', 'household1'],
    });
  });

  it('should handle errors when creating chore fails', async () => {
    const error = new Error('Failed to create chore');
    vi.mocked(choresService.createChore).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateChoreMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({
      name: 'Wash dishes',
      points: 5,
      categoryId: 'cat1',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useUpdateChoreMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a chore and invalidate related queries', async () => {
    const mockChore: ChoreResponseDto = {
      id: '1',
      name: 'Updated chore',
      points: 10,
      householdId: 'household1',
      categoryId: 'cat1',
      categoryName: 'Kitchen',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(choresService.updateChore).mockResolvedValue(mockChore);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateChoreMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    const updateData = {
      id: '1',
      data: {
        name: 'Updated chore',
        points: 10,
      },
    };
    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(choresService.updateChore).toHaveBeenCalledWith('household1', '1', {
      name: 'Updated chore',
      points: 10,
    });
    expect(choresService.updateChore).toHaveBeenCalledTimes(1);

    // Verify query invalidation
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'detail', 'household1', '1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'list', 'household1'],
    });
  });

  it('should handle errors when updating chore fails', async () => {
    const error = new Error('Failed to update chore');
    vi.mocked(choresService.updateChore).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUpdateChoreMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', data: { name: 'Updated chore' } });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useDeleteChoreMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a chore and invalidate chores list', async () => {
    vi.mocked(choresService.deleteChore).mockResolvedValue();

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteChoreMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(choresService.deleteChore).toHaveBeenCalledWith('household1', '1');
    expect(choresService.deleteChore).toHaveBeenCalledTimes(1);

    // Verify query invalidation
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'list', 'household1'],
    });
  });

  it('should handle errors when deleting chore fails', async () => {
    const error = new Error('Failed to delete chore');
    vi.mocked(choresService.deleteChore).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useDeleteChoreMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
