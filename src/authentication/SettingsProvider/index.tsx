import React, { useMemo, useCallback } from "react";
import { useHouseholdsQuery } from "../../hooks/queries/useHouseholdsQuery";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";
import { useChoresQuery } from "../../hooks/queries/useChoresQuery";
import { SettingsProviderContext } from "./context";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fetch households using react-query
  const {
    data: households,
    isLoading: householdsLoading,
    refetch: refetchHouseholds
  } = useHouseholdsQuery();

  // Get first household (or null)
  const household = useMemo(() => {
    if (!households || households.length === 0) return null;
    return households[0];
  }, [households]);

  // Fetch categories and chores for the selected household
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories
  } = useCategoriesQuery(household?.id || null);

  const {
    data: chores = [],
    isLoading: choresLoading,
    refetch: refetchChores
  } = useChoresQuery(household?.id || null);

  // Determine if all data is loaded
  const isLoaded = !householdsLoading && !categoriesLoading && !choresLoading;

  // Provide manual refetch capability
  const refetch = useCallback(async () => {
    await Promise.all([
      refetchHouseholds(),
      refetchCategories(),
      refetchChores(),
    ]);
  }, [refetchHouseholds, refetchCategories, refetchChores]);

  const value = useMemo(() => ({
    isLoaded,
    household,
    categories,
    chores,
    refetch,
  }), [isLoaded, household, categories, chores, refetch]);

  return (
    <SettingsProviderContext.Provider value={value}>
      {children}
    </SettingsProviderContext.Provider>
  );
};
