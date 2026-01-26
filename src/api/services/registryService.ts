import { api } from '../client';
import type {
  RegistryResponseDto,
  CreateRegistryEntryDto,
  BatchRegistryDto,
  RegistryQueryParams,
} from '../types';

export const registryService = {
  getRegistry: (
    householdId: string,
    params?: RegistryQueryParams
  ): Promise<RegistryResponseDto[]> => {
    const queryParams = new URLSearchParams();

    if (params?.filter) {
      queryParams.append('filter', params.filter);
    }
    if (params?.userId) {
      queryParams.append('userId', params.userId);
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/households/${householdId}/registry${
      queryString ? `?${queryString}` : ''
    }`;

    return api.get<RegistryResponseDto[]>(endpoint);
  },

  createRegistryEntry: (
    householdId: string,
    data: CreateRegistryEntryDto
  ): Promise<RegistryResponseDto> => {
    return api.post<RegistryResponseDto>(
      `/households/${householdId}/registry`,
      data
    );
  },

  createBatchRegistry: (
    householdId: string,
    data: BatchRegistryDto
  ): Promise<RegistryResponseDto[]> => {
    return api.post<RegistryResponseDto[]>(
      `/households/${householdId}/registry/batch`,
      data
    );
  },
};
