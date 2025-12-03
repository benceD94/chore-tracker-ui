import {
  collection,
  doc,
  type FirestoreDataConverter,
  DocumentReference,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  UserDoc,
  HouseholdDoc,
  CategoryDoc,
  ChoreDoc,
  RegistryEntryDoc,
} from "../types/firestore";

function dateFromFirestore<T extends object>(data: any): T {
  // converts Firestore Timestamps -> Date
  const result: any = { ...data };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (value && typeof value === "object" && "toDate" in value) {
      result[key] = (value as any).toDate();
    }
  }
  return result as T;
}

function createConverter<T extends object>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T) {
      return data as any;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options);
      return dateFromFirestore<T>(raw);
    },
  };
}

// Export generic helper type so you can use it in your models
export type Ref<T> = DocumentReference<T>;

// ---- Converters ----
const userConverter = createConverter<UserDoc>();
const householdConverter = createConverter<HouseholdDoc>();
const categoryConverter = createConverter<CategoryDoc>();
const choreConverter = createConverter<ChoreDoc>();
const registryConverter = createConverter<RegistryEntryDoc>();

// ---- Collection helpers ----

// users/{uid}
export const usersCol = () =>
  collection(db, "users").withConverter(userConverter);

// households/{householdId}
export const householdsCol = () =>
  collection(db, "households").withConverter(householdConverter);

// households/{householdId}/categories/{categoryId}
export const categoriesCol = (householdId: string) =>
  collection(db, "households", householdId, "categories").withConverter(
    categoryConverter
  );

// households/{householdId}/chores/{choreId}
export const choresCol = (householdId: string) =>
  collection(db, "households", householdId, "chores").withConverter(
    choreConverter
  );

// households/{householdId}/registry/{entryId}
export const registryCol = (householdId: string) =>
  collection(db, "households", householdId, "registry").withConverter(
    registryConverter
  );

// ---- Doc helpers ----
export const userDoc = (uid: string) =>
  doc(db, "users", uid).withConverter(userConverter);

export const householdDoc = (householdId: string) =>
  doc(db, "households", householdId).withConverter(householdConverter);
