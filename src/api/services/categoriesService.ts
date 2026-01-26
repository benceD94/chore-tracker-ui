import { api } from '../client';
import type {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types';

export const categoriesService = {
  getCategories: (householdId: string): Promise<CategoryResponseDto[]> => {
    return api.get<CategoryResponseDto[]>(`/households/${householdId}/categories`);
  },

  getCategory: (householdId: string, id: string): Promise<CategoryResponseDto> => {
    return api.get<CategoryResponseDto>(`/households/${householdId}/categories/${id}`);
  },

  createCategory: (
    householdId: string,
    data: CreateCategoryDto
  ): Promise<CategoryResponseDto> => {
    return api.post<CategoryResponseDto>(
      `/households/${householdId}/categories`,
      data
    );
  },

  updateCategory: (
    householdId: string,
    id: string,
    data: UpdateCategoryDto
  ): Promise<CategoryResponseDto> => {
    return api.patch<CategoryResponseDto>(
      `/households/${householdId}/categories/${id}`,
      data
    );
  },

  deleteCategory: (householdId: string, id: string): Promise<void> => {
    return api.delete<void>(`/households/${householdId}/categories/${id}`);
  },
};
