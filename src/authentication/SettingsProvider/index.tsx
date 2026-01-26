import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { HouseholdResponseDto, CategoryResponseDto, ChoreResponseDto, UserResponseDto } from "../../api/types";
import { useAuth } from "../AuthContext";
import { useToast } from "../../components/ToastProvider";
import { householdsService } from "../../api/services/householdsService";
import { categoriesService } from "../../api/services/categoriesService";
import { choresService } from "../../api/services/choresService";

// Temporary type for household with members
// TODO: Update when backend provides member details
type HouseholdWithMembers = HouseholdResponseDto & {
  memberDetails?: UserResponseDto[]; // Will be populated with user details
};

type SettingsProviderContextValue = {
  isLoaded: boolean;
  household: HouseholdResponseDto | null;
  categories: CategoryResponseDto[];
  chores: ChoreResponseDto[];
  refetch: () => Promise<void>;
};

const SettingsProviderContext = createContext<SettingsProviderContextValue>({
  household: null,
  isLoaded: false,
  categories: [],
  chores: [],
  refetch: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { notify } = useToast();

  const [internalIsLoaded, setInternalIsLoaded] = useState(false);
  const [internalHousehold, setInternalHousehold] = useState<HouseholdWithMembers | null>(null);
  const [internalCategories, setInternalCategories] = useState<CategoryResponseDto[]>([]);
  const [internalChores, setInternalChores] = useState<ChoreResponseDto[]>([]);

  const loadData = useCallback(async () => {
    if (!user?.uid) {
      setInternalHousehold(null);
      setInternalCategories([]);
      setInternalChores([]);
      setInternalIsLoaded(true);
      return;
    }

    try {
      // Fetch households for the current user
      const households = await householdsService.getHouseholds();

      if (households.length === 0) {
        setInternalHousehold(null);
        setInternalCategories([]);
        setInternalChores([]);
        setInternalIsLoaded(true);
        return;
      }

      // Use the first household
      const household = households[0];
      setInternalHousehold(household);

      // Fetch categories and chores for this household in parallel
      const [categories, chores] = await Promise.all([
        categoriesService.getCategories(household.id),
        choresService.getChores(household.id),
      ]);

      setInternalCategories(categories);
      setInternalChores(chores);
      setInternalIsLoaded(true);
    } catch (err) {
      notify.error('Error loading household data');
      console.error("Error loading household data:", err);
      setInternalIsLoaded(true);
    }
  }, [user?.uid, notify]);

  // Load data when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return (
    <SettingsProviderContext.Provider
      value={{
        isLoaded: internalIsLoaded,
        household: internalHousehold,
        categories: internalCategories,
        chores: internalChores,
        refetch,
      }}
    >
      {children}
    </SettingsProviderContext.Provider>
  );
};

export const useSettingsProvider = () => useContext(SettingsProviderContext);
