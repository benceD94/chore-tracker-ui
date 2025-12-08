import type { Ref } from "../utils/firebaseRefs";

export type UserDoc = {
  id: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
};

export type HouseholdDoc = {
  name: string;
  id: string;
  memberIds: string[];
  members: UserDoc[];
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
  id: string;
  choreRef: Ref<ChoreDoc>;
  userRef: Ref<UserDoc>;
  points: number;
  completedAt: Date;
};
