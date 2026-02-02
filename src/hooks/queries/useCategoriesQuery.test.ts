import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCategoriesQuery, useCategoryQuery } from './useCategoriesQuery';
import { createTestQueryClient, createWrapper } from '../../test/utils';
import type { CategoryResponseDto } from '../../api/types';

vi.mock('../../api/services/categoriesService', () => ({
  categoriesService: {
    getCategories: vi.fn(),
    getCategory: vi.fn(),
  },
}));

import { categoriesService } from '../../api/services/categoriesService';

describe('useCategoriesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch categories when householdId is provided', async () => {
    const mockCategories: CategoryResponseDto[] = [
      { id: '1', name: 'Kitchen', householdId: 'household1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', name: 'Bathroom', householdId: 'household1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];

    vi.mocked(categoriesService.getCategories).mockResolvedValue(mockCategories);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoriesQuery('household1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCategories);
    expect(categoriesService.getCategories).toHaveBeenCalledWith('household1');
    expect(categoriesService.getCategories).toHaveBeenCalledTimes(1);
  });

  it('should not fetch categories when householdId is null', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoriesQuery(null), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(categoriesService.getCategories).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching categories fails', async () => {
    const error = new Error('Failed to fetch categories');
    vi.mocked(categoriesService.getCategories).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoriesQuery('household1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
    expect(categoriesService.getCategories).toHaveBeenCalledWith('household1');
  });
});

describe('useCategoryQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a single category when both householdId and categoryId are provided', async () => {
    const mockCategory: CategoryResponseDto = {
      id: '1',
      name: 'Kitchen',
      householdId: 'household1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(categoriesService.getCategory).mockResolvedValue(mockCategory);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoryQuery('household1', '1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCategory);
    expect(categoriesService.getCategory).toHaveBeenCalledWith('household1', '1');
    expect(categoriesService.getCategory).toHaveBeenCalledTimes(1);
  });

  it('should not fetch when householdId is null', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoryQuery(null, '1'), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(categoriesService.getCategory).not.toHaveBeenCalled();
  });

  it('should not fetch when categoryId is null', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoryQuery('household1', null), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(categoriesService.getCategory).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching category fails', async () => {
    const error = new Error('Failed to fetch category');
    vi.mocked(categoriesService.getCategory).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCategoryQuery('household1', '1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
    expect(categoriesService.getCategory).toHaveBeenCalledWith('household1', '1');
  });
});
