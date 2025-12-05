import { query, orderBy } from "firebase/firestore";
import { useCollection } from "./useCollection";
import type { CategoryDoc } from "../types/firestore";
import { categoriesCol } from "../utils/firebaseRefs";

export function useCategories(householdId: string | null) {
  const q =
    householdId == null
      ? null
      : query(categoriesCol(householdId), orderBy("name", "asc"));

  return useCollection<CategoryDoc>(q);
}