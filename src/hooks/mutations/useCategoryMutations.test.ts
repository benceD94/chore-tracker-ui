import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from './useCategoryMutations';
import { createTestQueryClient, createWrapper } from '../../test/utils';
import type { CategoryResponseDto } from '../../api/types';

vi.mock('../../api/services/categoriesService', () => ({
  categoriesService: {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

import { categoriesService } from '../../api/services/categoriesService';

describe('useCreateCategoryMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a category and invalidate related queries', async () => {
    const mockCategory: CategoryResponseDto = {
      id: '1',
      name: 'Kitchen',
      householdId: 'household1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(categoriesService.createCategory).mockResolvedValue(mockCategory);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateCategoryMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    const newCategoryData = { name: 'Kitchen' };
    result.current.mutate(newCategoryData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(categoriesService.createCategory).toHaveBeenCalledWith('household1', newCategoryData);
    expect(categoriesService.createCategory).toHaveBeenCalledTimes(1);

    // Verify query invalidation
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['categories', 'list', 'household1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'list', 'household1'],
    });
  });

  it('should handle errors when creating category fails', async () => {
    const error = new Error('Failed to create category');
    vi.mocked(categoriesService.createCategory).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateCategoryMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ name: 'Kitchen' });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useUpdateCategoryMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a category and invalidate related queries', async () => {
    const mockCategory: CategoryResponseDto = {
      id: '1',
      name: 'Updated Kitchen',
      householdId: 'household1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(categoriesService.updateCategory).mockResolvedValue(mockCategory);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateCategoryMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    const updateData = { id: '1', data: { name: 'Updated Kitchen' } };
    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(categoriesService.updateCategory).toHaveBeenCalledWith('household1', '1', { name: 'Updated Kitchen' });
    expect(categoriesService.updateCategory).toHaveBeenCalledTimes(1);

    // Verify query invalidation
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['categories', 'detail', 'household1', '1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['categories', 'list', 'household1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'list', 'household1'],
    });
  });

  it('should handle errors when updating category fails', async () => {
    const error = new Error('Failed to update category');
    vi.mocked(categoriesService.updateCategory).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUpdateCategoryMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', data: { name: 'Updated Kitchen' } });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useDeleteCategoryMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a category and invalidate related queries', async () => {
    vi.mocked(categoriesService.deleteCategory).mockResolvedValue();

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteCategoryMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(categoriesService.deleteCategory).toHaveBeenCalledWith('household1', '1');
    expect(categoriesService.deleteCategory).toHaveBeenCalledTimes(1);

    // Verify query invalidation
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['categories', 'list', 'household1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['chores', 'list', 'household1'],
    });
  });

  it('should handle errors when deleting category fails', async () => {
    const error = new Error('Failed to delete category');
    vi.mocked(categoriesService.deleteCategory).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useDeleteCategoryMutation('household1'), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
