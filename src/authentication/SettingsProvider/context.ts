import { createContext } from "react";
import type { HouseholdResponseDto, CategoryResponseDto, ChoreResponseDto } from "../../api/types";

export type SettingsProviderContextValue = {
  isLoaded: boolean;
  household: HouseholdResponseDto | null;
  categories: CategoryResponseDto[];
  chores: ChoreResponseDto[];
  refetch: () => Promise<void>;
};

export const SettingsProviderContext = createContext<SettingsProviderContextValue>({
  household: null,
  isLoaded: false,
  categories: [],
  chores: [],
  refetch: async () => {},
});
