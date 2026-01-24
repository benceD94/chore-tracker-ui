# Project Context: Chore Tracker

You are assisting with a personal project called **Chore Tracker**.

The goal of this project is to help small households (friends / family) track chores, assign points, and maintain a fair, motivating system over time. The project prioritizes simplicity, correctness, and long-term maintainability over premature scale.

---

## Tech Stack (Current)

### Frontend
- React
- TypeScript
- React Router
- Firebase Authentication (Google Auth)
- Firebase Firestore
- Hosted on GitHub Pages

### Backend (Current)
- Firebase Firestore (NoSQL)
- Firebase Authentication

### Planned / Future
- Potential migration to a real backend instead of just firebase
- Node.js with TypeScript preferred
- Relational database likely (PostgreSQL)
- Clean domain-driven data models
- Cost-effective and low-maintenance setup

---

## Domain Model (High-Level)

### Household
- Represents a group of users (friends or family)
- Owns categories, chores, and registry entries

### Category
- Represents a category of chores

### Chore
- Represents a chore the user does
- Has a name, category and worth some points

### Registry Entry
- Represents a completed chore
- Linked to a chore, user, household, and date
- Used for statistics and fairness tracking

### Product Principles
- This is not a public app
- Access is intentionally restricted
- UX should be simple and obvious
- Avoid over-engineering
- Prefer clarity over clever abstractions
- Optimize for small user counts (single-digit households)

### Coding Guidelines
- Use TypeScript strictly
- Prefer explicit types over inference for domain objects
- Avoid any
- Keep functions small and readable
- Favor pure functions where possible
- React hooks should be predictable and side-effect aware
- Firebase logic should be isolated from UI logic

### Firebase / Data Rules
- Firestore documents must always have an ID
- Never rely on array indexes as identifiers
- Keep Firestore reads minimal
- Be mindful of client-side filtering vs query costs
- Avoid deeply nested collections unless necessary

### State Management
- Use React's Context API for shared state
- Keep context providers focused and single-purpose
- Avoid prop drilling by lifting shared state to appropriate context
- Custom hooks should encapsulate context access patterns

### Error Handling
- Show toast messages to the user for errors when possible
- Use console.error for development debugging
- Keep error messages user-friendly and actionable
- Log enough context for troubleshooting in the console

### Testing
- Use Jest for unit tests
- Each component should have a corresponding test file
- Test that component properties work as expected
- All helper functions must have test coverage
- Keep tests focused and readable

### How Claude Should Help
When responding:
- Prefer concrete, production-ready suggestions
- Explain why something is done a certain way
- Point out hidden pitfalls (Firestore, auth, routing, hosting)
- Suggest simpler alternatives when complexity is unnecessary
- If multiple approaches exist, recommend one default solution
- Ask at most one clarifying question when needed

### Tone & Assumptions
- Be pragmatic
- Assume the developer is experienced
- No beginner-level explanations unless explicitly asked
- Optimize for long-term maintainability and clarity
