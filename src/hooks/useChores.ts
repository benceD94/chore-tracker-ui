import { query, orderBy } from "firebase/firestore";
import { useCollection } from "./useCollection";
import type { ChoreDoc } from "../types/firestore";
import { choresCol } from "../utils/firebaseRefs";

export function useChores(householdId: string | null) {
  const q =
    householdId == null
      ? null
      : query(choresCol(householdId), orderBy("name", "asc"));

  return useCollection<ChoreDoc>(q);
}