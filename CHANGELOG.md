# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-01

### Added
- Integrated @tanstack/react-query for data fetching and cache management
- Query hooks for households, categories, chores, and registry (useHouseholdsQuery, useCategoriesQuery, useChoresQuery, useRegistryQuery)
- Mutation hooks with automatic cache invalidation (useCreateCategoryMutation, useUpdateChoreMutation, useDeleteCategoryMutation, etc.)
- React Query Devtools for development debugging and cache inspection
- Query key factory for type-safe cache management and granular invalidation
- CHANGELOG.md to track version history and changes

### Changed
- Migrated SettingsProvider to use react-query internally instead of manual data fetching
- Replaced manual `useFetch` hook with declarative `useQuery` hooks
- Improved loading states and error handling across all components (Categories, Chores, Dashboard, Households)
- Mutations now automatically invalidate and refetch related queries
- Cross-entity cache invalidation (e.g., updating a category now refreshes chores that reference it)

### Removed
- Manual data fetching logic in SettingsProvider (replaced by react-query)
- `useFetch` hook (replaced by @tanstack/react-query)
- `useHouseholds`, `useCategories`, `useChores`, `useRegistry` hooks (replaced by query hooks)
- `src/infra/` mutation helpers (replaced by mutation hooks)
- Manual loading state management in components

### Technical
- Added query key factory with hierarchical structure for granular cache invalidation
- Configured QueryClient with 5-minute staleTime and 30-minute gcTime for optimal performance
- Enabled automatic refetching on window focus and network reconnect
- Set up proper TypeScript types for all query and mutation hooks

### Fixed
- Data not automatically refreshing after mutations (now handled by cache invalidation)
- Multiple network requests for the same data (now cached by react-query)
- Stale data displayed when navigating between pages (now properly managed by query cache)

## [0.0.0] - Previous

### Initial Release
- Firebase Authentication integration with Google Auth
- Household, category, chore, and registry management
- Dashboard with leaderboard and summary statistics
- Material-UI design system
- Real backend API with Node.js and PostgreSQL
