import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import type { CategoryDoc, ChoreDoc, HouseholdDoc, UserDoc } from "../../types/firestore";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { Collection } from "../../enums/firebase";

type SettingsProviderContextValue = {
  isLoaded: boolean;
  household: HouseholdDoc | null;
  categories: CategoryDoc[];
  chores: ChoreDoc[];
};

const SettingsProviderContext = createContext<SettingsProviderContextValue>({
  household: null,
  isLoaded: false,
  categories: [],
  chores: [],
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [internalIsLoaded, setInternalIsLoaded] = useState(false);
  const [internalHousehold, setInternalHousehold] = useState<HouseholdDoc | null>(null);
  const [internalCategories, setInternalCategories] = useState<CategoryDoc[]>([]);
  const [internalChores, setInternalChores] = useState<ChoreDoc[]>([]);

  // useEffect(() => {
  //   const householdsRef = collection(db, Collection.Households);
  //   const q = query(
  //     householdsRef,
  //     where("memberIds", "array-contains", user?.uid)
  //   );

  //   const unsubscribe = onSnapshot(
  //     q,
  //     (snapshot) => {
  //       const docs: HouseholdDoc[] = snapshot.docs.map((docSnap) => {
  //         const data = docSnap.data() as Omit<HouseholdDoc, "id">;
  //         return {
  //           id: docSnap.id,
  //           ...data,
  //         };
  //       });
  //       setInternalHousehold(docs[0]);
  //       setInternalIsLoaded(true);
  //     },
  //     (err) => {
  //       console.error("Error fetching households:", err);
  //       setInternalIsLoaded(true);
  //     }
  //   );

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
  if (!user?.uid) {
    // no logged-in user yet → nothing to load
    return;
  }

  const householdsRef = collection(db, Collection.Households);
  const q = query(
    householdsRef,
    where("memberIds", "array-contains", user.uid)
  );

  let cancelled = false;

  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      try {
        const docs: HouseholdDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<HouseholdDoc, "id">;
          return {
            id: docSnap.id,
            ...data,
          };
        });

        const first = docs[0];

        if (!first) {
          if (!cancelled) {
            setInternalHousehold(null);
            setInternalIsLoaded(true);
          }
          return;
        }

        // 🔽 load members from users/{uid}
        const memberPromises = first.memberIds.map(async (uid) => {
          const userRef = doc(db, Collection.Users, uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) return null;

          const data = snap.data() as Omit<UserDoc, "id">;
          return { id: snap.id, ...data } satisfies UserDoc;
        });

        const membersRaw = await Promise.all(memberPromises);
        const members = membersRaw.filter(
          (m): m is UserDoc => m !== null
        );

        if (!cancelled) {
          const householdWithMembers: HouseholdDoc = {
            ...first,
            members,
          };
          setInternalHousehold(householdWithMembers);
          setInternalIsLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching households or members:", err);
        if (!cancelled) {
          setInternalIsLoaded(true);
        }
      }
    },
    (err) => {
      console.error("Error fetching households:", err);
      setInternalIsLoaded(true);
    }
  );

  return () => {
    cancelled = true;
    unsubscribe();
  };
}, [user?.uid]);

  useEffect(() => {
    if (!internalHousehold) return;

    const categoriesRef = collection(
      db,
      Collection.Households,
      internalHousehold.id,
      Collection.Categories,
    );

    const choresRef = collection(
      db,
      Collection.Households,
      internalHousehold.id,
      Collection.Chores,
    );

    const unsubscribeCategories = onSnapshot(
      categoriesRef,
      (snapshot) => {
        const docs: CategoryDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<CategoryDoc, "id">;
          return {
            id: docSnap.id,
            ...data,
          };
        });
        setInternalCategories(docs);
      },
      (err) => {
        console.error("Error fetching categories:", err);
      }
    );

    const unsubscribeChores = onSnapshot(
      choresRef,
      (snapshot) => {
        const docs: ChoreDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<ChoreDoc, "id">;
          return {
            id: docSnap.id,
            ...data,
          };
        });
        setInternalChores(docs);
      },
      (err) => {
        console.error("Error fetching chores:", err);
      }
    );

    return () => {
      unsubscribeCategories();
      unsubscribeChores();
    };
  }, [internalHousehold]);

  return (
    <SettingsProviderContext.Provider value={{
      isLoaded: internalIsLoaded,
      household: internalHousehold,
      categories: internalCategories,
      chores: internalChores,
    }}>
      {children}
    </SettingsProviderContext.Provider>
  );
};

export const useSettingsProvider = () => useContext(SettingsProviderContext);
