import { api } from '../client';
import type { ChoreResponseDto, CreateChoreDto, UpdateChoreDto } from '../types';

export const choresService = {
  getChores: (householdId: string): Promise<ChoreResponseDto[]> => {
    return api.get<ChoreResponseDto[]>(`/households/${householdId}/chores`);
  },

  getChore: (householdId: string, id: string): Promise<ChoreResponseDto> => {
    return api.get<ChoreResponseDto>(`/households/${householdId}/chores/${id}`);
  },

  createChore: (
    householdId: string,
    data: CreateChoreDto
  ): Promise<ChoreResponseDto> => {
    return api.post<ChoreResponseDto>(`/households/${householdId}/chores`, data);
  },

  updateChore: (
    householdId: string,
    id: string,
    data: UpdateChoreDto
  ): Promise<ChoreResponseDto> => {
    return api.patch<ChoreResponseDto>(
      `/households/${householdId}/chores/${id}`,
      data
    );
  },

  deleteChore: (householdId: string, id: string): Promise<void> => {
    return api.delete<void>(`/households/${householdId}/chores/${id}`);
  },
};
