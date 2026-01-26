// Legacy types - prefer using API types from ../api/types.ts
// These are kept for backward compatibility during migration

export type UserDoc = {
  id: string;
  displayName: string;
  photoURL?: string;
  createdAt: string; // Changed to match API - ISO date string
};

export type HouseholdDoc = {
  name: string;
  id: string;
  memberIds: string[]; // Changed to match API - array of user IDs
  memberDetails?: UserDoc[]; // Optional denormalized member data
  createdAt: string; // Changed to match API - ISO date string
  createdBy: string;
};

export type CategoryDoc = {
  name: string;
  id: string;
};

export type ChoreDoc = {
  id: string;
  name: string;
  points?: number; // Made optional to match API response
  categoryId?: string; // Made optional to match API response
  categoryName?: string; // Made optional to match API response
  createdAt: string; // Changed to match API - ISO date string
  isActive?: boolean; // Made optional since API may not return this
};

export type RegistryEntryDoc = {
  id: string;
  choreId: string; // Changed from choreRef
  userId: string; // Changed from userRef
  points: number;
  completedAt: string; // Changed to match API - ISO date string
};
