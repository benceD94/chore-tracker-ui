import { query, orderBy, where, doc } from "firebase/firestore";
import { useCollection } from "./useCollection";
import type { RegistryEntryDoc } from "../types/firestore";
import { registryCol } from "../utils/firebaseRefs";
import { db } from "../utils/firebase";

export function useRegistry(householdId: string | null) {
  const q =
    householdId == null
      ? null
      : query(registryCol(householdId), orderBy("completedAt", "desc"));

  return useCollection<RegistryEntryDoc>(q);
}

export function useRegistryForUser(
  householdId: string | null,
  userId: string | null
) {
  if (!householdId || !userId) {
    return { data: null, loading: false, error: null };
  }

  const userRef = doc(db, "users", userId); // we don't need converter here

  const q = query(
    registryCol(householdId),
    where("userRef", "==", userRef),
    orderBy("completedAt", "desc")
  );

  return useCollection<RegistryEntryDoc>(q);
}
