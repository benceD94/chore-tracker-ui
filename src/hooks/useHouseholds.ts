import { query, orderBy } from "firebase/firestore";
import { useCollection } from "./useCollection";
import type { CategoryDoc } from "../types/firestore";
import { householdsCol } from "../utils/firebaseRefs";

export function useHouseholds() {
  const q = query(householdsCol(), orderBy("name", "asc"));

  return useCollection<CategoryDoc>(q);
}