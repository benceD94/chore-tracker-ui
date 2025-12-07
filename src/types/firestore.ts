import type { Ref } from "../utils/firebaseRefs";

export type UserDoc = {
  displayName: string;
  photoURL?: string;
  createdAt: Date;
};

export type HouseholdDoc = {
  name: string;
  id: string;
  memberIds: string[];
  createdAt: Date;
  createdBy: string;
};

export type CategoryDoc = {
  name: string;
  id: string;
};

export type ChoreDoc = {
  id: string;
  name: string;
  points: number;
  categoryRef: Ref<CategoryDoc>;
  categoryName: string;
  createdAt: Date;
  isActive: boolean;
};

export type RegistryEntryDoc = {
  choreRef: Ref<ChoreDoc>;
  userRef: Ref<UserDoc>;
  points: number;
  completedAt: Date;
};
