import { query, orderBy, where, doc, collection, limit, onSnapshot, DocumentReference, getDoc, QueryConstraint } from "firebase/firestore";
import { useCollection } from "./useCollection";
import type { ChoreDoc, RegistryEntryDoc, UserDoc } from "../types/firestore";
import { registryCol } from "../utils/firebaseRefs";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";
import { useToast } from "../components/ToastProvider";

export type RegistryEntryView = {
  id: string;
  points: number;
  completedAt: Date | null;

  choreId: string;
  choreName: string;
  chorePoints: number;
  categoryName: string;

  userId: string;
  userName: string;
  userPhotoURL?: string;
};

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

export enum RegistryDateFilter {
  All = "all",
  Today = "today",
  Yesterday = "yesterday",
  ThisWeek = "thisWeek",
  LastWeek = "lastWeek",
  ThisMonth = "thisMonth",
}

// helper: returns [start, end) range in local time
function getDateRange(filter: RegistryDateFilter): {
  start: Date | null;
  end: Date | null;
} {
  const now = new Date();

  // midnight helper (local timezone)
  const atMidnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const todayStart = atMidnight(now);
  const tomorrowStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    todayStart.getDate() + 1
  );
  const yesterdayStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    todayStart.getDate() - 1
  );

  // assume week starts on Monday
  const day = todayStart.getDay(); // 0=Sun, 1=Mon,...
  const diffToMonday = (day + 6) % 7; // 0 if Monday, 1 if Tuesday, ...
  const thisWeekStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    todayStart.getDate() - diffToMonday
  );
  const nextWeekStart = new Date(
    thisWeekStart.getFullYear(),
    thisWeekStart.getMonth(),
    thisWeekStart.getDate() + 7
  );
  const lastWeekStart = new Date(
    thisWeekStart.getFullYear(),
    thisWeekStart.getMonth(),
    thisWeekStart.getDate() - 7
  );

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  switch (filter) {
    case "today":
      return { start: todayStart, end: tomorrowStart };
    case "yesterday":
      return { start: yesterdayStart, end: todayStart };
    case "thisWeek":
      return { start: thisWeekStart, end: nextWeekStart };
    case "lastWeek":
      return { start: lastWeekStart, end: thisWeekStart };
    case "thisMonth":
      return { start: thisMonthStart, end: nextMonthStart };
    case "all":
    default:
      return { start: null, end: null };
  }
}

export function useRegistryView(householdId: string | null, filter: RegistryDateFilter) {
  const {notify} = useToast();
  const [entries, setEntries] = useState<RegistryEntryView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    if (!householdId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const registryRef = collection(db, "households", householdId, "registry");
    const { start, end } = getDateRange(filter);

    const constraints: QueryConstraint[] = [];

    if (start) {
      constraints.push(where("completedAt", ">=", start));
    }
    if (end) {
      constraints.push(where("completedAt", "<", end));
    }
    
    constraints.push(orderBy("completedAt", "desc"));
    constraints.push(limit(50));

    const q = query(registryRef, ...constraints);

    let cancelled = false;

    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const baseEntries: RegistryEntryDoc[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as any;
            return {
              id: docSnap.id,
              points: data.points ?? 0,
              completedAt: data.completedAt?.toDate
                ? data.completedAt.toDate()
                : null,
              choreRef: data.choreRef as any,
              userRef: data.userRef as any,
            };
          });

          const choreRefSet = new Map<string, DocumentReference>();
          const userRefSet = new Map<string, DocumentReference>();

          baseEntries.forEach((entry) => {
            if (entry.choreRef) {
              choreRefSet.set(entry.choreRef.path, entry.choreRef);
            }
            if (entry.userRef) {
              userRefSet.set(entry.userRef.path, entry.userRef);
            }
          });

          const [choreDocs, userDocs] = await Promise.all([
            Promise.all(
              Array.from(choreRefSet.values()).map((ref) => getDoc(ref))
            ),
            Promise.all(
              Array.from(userRefSet.values()).map((ref) => getDoc(ref))
            ),
          ]);

          const choreMap = new Map<string, ChoreDoc>();
          choreDocs.forEach((snap) => {
            if (snap.exists()) {
              choreMap.set(snap.ref.path, snap.data() as ChoreDoc);
            }
          });

          const userMap = new Map<string, { id: string; doc: UserDoc }>();
          userDocs.forEach((snap) => {
            if (snap.exists()) {
              userMap.set(snap.ref.path, {
                id: snap.id,
                doc: snap.data() as UserDoc,
              });
            }
          });

          if (cancelled) return;

          const viewEntries: RegistryEntryView[] = baseEntries.map((entry) => {
            const chore = choreMap.get(entry.choreRef.path);
            const user = userMap.get(entry.userRef.path);

            const choreId = entry.choreRef.id;
            const choreName = chore?.name ?? "Unknown chore";
            const chorePoints = chore?.points ?? entry.points ?? 0;
            const categoryName = chore?.categoryName ?? "";

            const userName = user?.doc.displayName ?? "Unknown user";
            const userId = user?.id ?? "unknown";
            const userPhotoURL = user?.doc.photoURL;

            return {
              id: entry.id,
              points: entry.points ?? chorePoints,
              completedAt: entry.completedAt,

              choreId,
              choreName,
              chorePoints,
              categoryName,

              userId,
              userName,
              userPhotoURL,
            };
          });


          setEntries(viewEntries);
          setLoading(false);
        } catch (err: any) {
          notify.error('Error fetching households');
          console.error("Error building registry view:", err);
          if (!cancelled) {
            setError(err);
            setLoading(false);
          }
        }
      },
      (err) => {
        notify.error('Error listening to registry');
        console.error("Error listening to registry:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [householdId, filter]);

  return { entries, loading, error };
}
