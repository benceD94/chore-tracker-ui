import type { RegistryQueryParams } from '../api/types';

export const queryKeys = {
  // Households
  households: {
    all: ['households'] as const,
    lists: () => [...queryKeys.households.all, 'list'] as const,
    list: () => [...queryKeys.households.lists()] as const,
    details: () => [...queryKeys.households.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.households.details(), id] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (householdId: string) =>
      [...queryKeys.categories.lists(), householdId] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (householdId: string, id: string) =>
      [...queryKeys.categories.details(), householdId, id] as const,
  },

  // Chores
  chores: {
    all: ['chores'] as const,
    lists: () => [...queryKeys.chores.all, 'list'] as const,
    list: (householdId: string) =>
      [...queryKeys.chores.lists(), householdId] as const,
    details: () => [...queryKeys.chores.all, 'detail'] as const,
    detail: (householdId: string, id: string) =>
      [...queryKeys.chores.details(), householdId, id] as const,
  },

  // Registry
  registry: {
    all: ['registry'] as const,
    lists: () => [...queryKeys.registry.all, 'list'] as const,
    list: (householdId: string, filters?: RegistryQueryParams) =>
      [...queryKeys.registry.lists(), householdId, filters] as const,
  },
} as const;
