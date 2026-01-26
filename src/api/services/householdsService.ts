import { api } from '../client';
import type {
  HouseholdResponseDto,
  CreateHouseholdDto,
  UpdateHouseholdDto,
  AddMemberDto,
} from '../types';

export const householdsService = {
  getHouseholds: (): Promise<HouseholdResponseDto[]> => {
    return api.get<HouseholdResponseDto[]>('/households');
  },

  getHousehold: (id: string): Promise<HouseholdResponseDto> => {
    return api.get<HouseholdResponseDto>(`/households/${id}`);
  },

  createHousehold: (data: CreateHouseholdDto): Promise<HouseholdResponseDto> => {
    return api.post<HouseholdResponseDto>('/households', data);
  },

  updateHousehold: (
    id: string,
    data: UpdateHouseholdDto
  ): Promise<HouseholdResponseDto> => {
    return api.patch<HouseholdResponseDto>(`/households/${id}`, data);
  },

  addMember: (householdId: string, userId: string): Promise<HouseholdResponseDto> => {
    return api.post<HouseholdResponseDto>(
      `/households/${householdId}/members`,
      { userId } as AddMemberDto
    );
  },
};
