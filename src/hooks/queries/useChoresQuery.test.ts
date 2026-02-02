import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChoresQuery, useChoreQuery } from './useChoresQuery';
import { createTestQueryClient, createWrapper } from '../../test/utils';
import type { ChoreResponseDto } from '../../api/types';

vi.mock('../../api/services/choresService', () => ({
  choresService: {
    getChores: vi.fn(),
    getChore: vi.fn(),
  },
}));

import { choresService } from '../../api/services/choresService';

describe('useChoresQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch chores when householdId is provided', async () => {
    const mockChores: ChoreResponseDto[] = [
      {
        id: '1',
        name: 'Wash dishes',
        points: 5,
        householdId: 'household1',
        categoryId: 'cat1',
        categoryName: 'Kitchen',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        name: 'Clean bathroom',
        points: 10,
        householdId: 'household1',
        categoryId: 'cat2',
        categoryName: 'Bathroom',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    vi.mocked(choresService.getChores).mockResolvedValue(mockChores);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoresQuery('household1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockChores);
    expect(choresService.getChores).toHaveBeenCalledWith('household1');
    expect(choresService.getChores).toHaveBeenCalledTimes(1);
  });

  it('should not fetch chores when householdId is null', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoresQuery(null), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(choresService.getChores).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching chores fails', async () => {
    const error = new Error('Failed to fetch chores');
    vi.mocked(choresService.getChores).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoresQuery('household1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
    expect(choresService.getChores).toHaveBeenCalledWith('household1');
  });
});

describe('useChoreQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a single chore when both householdId and choreId are provided', async () => {
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

    vi.mocked(choresService.getChore).mockResolvedValue(mockChore);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoreQuery('household1', '1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockChore);
    expect(choresService.getChore).toHaveBeenCalledWith('household1', '1');
    expect(choresService.getChore).toHaveBeenCalledTimes(1);
  });

  it('should not fetch when householdId is null', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoreQuery(null, '1'), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(choresService.getChore).not.toHaveBeenCalled();
  });

  it('should not fetch when choreId is null', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoreQuery('household1', null), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(choresService.getChore).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching chore fails', async () => {
    const error = new Error('Failed to fetch chore');
    vi.mocked(choresService.getChore).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useChoreQuery('household1', '1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
    expect(choresService.getChore).toHaveBeenCalledWith('household1', '1');
  });
});
