import { onAuthStateChanged, type User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import type { HouseholdDoc } from "../../types/firestore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { Collection } from "../../enums/firebase";

type SettingsProviderContextValue = {
  isLoaded: boolean;
  household: HouseholdDoc | null;
};

const defaultCallback = () => {
  throw new Error('SettingsProviderContext not initialized.');
};

const SettingsProviderContext = createContext<SettingsProviderContextValue>({
  household: null,
  isLoaded: false,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [internalHousehold, setInternalHousehold] = useState<HouseholdDoc | null>(null);
  const [internalIsLoaded, setInternalIsLoaded] = useState(false);

  useEffect(() => {
    const householdsRef = collection(db, Collection.Households);
    const q = query(
      householdsRef,
      where("memberIds", "array-contains", user?.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: HouseholdDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<HouseholdDoc, "id">;
          return {
            id: docSnap.id,
            ...data,
          };
        });
        setInternalHousehold(docs[0]);
        setInternalIsLoaded(true);
      },
      (err) => {
        console.error("Error fetching households:", err);
        setInternalIsLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SettingsProviderContext.Provider value={{
      isLoaded: internalIsLoaded,
      household: internalHousehold,
    }}>
      {children}
    </SettingsProviderContext.Provider>
  );
};

export const useSettingsProvider = () => useContext(SettingsProviderContext);
