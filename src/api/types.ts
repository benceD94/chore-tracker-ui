// Helper function to parse ISO date strings to Date objects
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

// Auth DTOs
export interface LoginDto {
  idToken: string;
}

export interface AuthResponseDto {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
}

// User DTOs
export interface CreateUserDto {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export interface UserResponseDto {
  id: string;
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

// Household DTOs
export interface CreateHouseholdDto {
  name: string;
}

export interface UpdateHouseholdDto {
  name: string;
}

export interface AddMemberDto {
  userId: string;
}

export interface HouseholdResponseDto {
  id: string;
  name: string;
  memberIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Category DTOs
export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

export interface CategoryResponseDto {
  id: string;
  householdId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Chore DTOs
export interface CreateChoreDto {
  name: string;
  description?: string;
  categoryId?: string;
  assignedTo?: string[];
  points?: number;
}

export interface UpdateChoreDto {
  name?: string;
  description?: string;
  categoryId?: string;
  assignedTo?: string[];
  points?: number;
}

export interface ChoreResponseDto {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  categoryId?: string;
  categoryName?: string; // Denormalized category name
  assignedTo?: string[];
  points?: number; // Points/value of the chore
  createdAt: string;
  updatedAt: string;
}

// Registry DTOs
export interface CreateRegistryEntryDto {
  choreId: string;
  userId: string;
  times?: number;
}

export interface BatchRegistryDto {
  chores: CreateRegistryEntryDto[];
}

export interface RegistryResponseDto {
  id: string;
  householdId: string;
  choreId: string;
  choreName: string; // Denormalized chore name
  userId: string;
  userName: string; // Denormalized user display name
  times: number;
  points: number;
  completedAt: string;
  createdAt: string;
}

// Registry query parameters
export type RegistryDateFilter =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'all';

export interface RegistryQueryParams {
  filter?: RegistryDateFilter;
  userId?: string;
  limit?: number;
}
