# Testing Strategy

## Current State

- **Frontend:** Karma + Jasmine configured. Spec files exist for most components but are boilerplate (default `ng generate` output).
- **Backend:** No test framework installed. `npm test` exits with error. No unit or integration tests.
- **E2E:** No end-to-end testing setup.

## Test Files Present

Frontend spec files exist in `src/app/` for: `AppComponent`, `ClipCard`, `ClipCreate`, `ShowsList`, `ShowsService`, `ClipsService`, `SingleShowView`, `FriendCard`, `FriendsList`, `FriendsSearch`, `FriendsShowsList`, `ChangePassword`, `ForgetPassword`, `AuthService`.

## Recommended Migration

1. **Frontend:** Replace Karma/Jasmine with Jest (Angular 17+ default)
2. **Backend:** Add Jest or Vitest with Supertest for API testing
3. **E2E:** Add Playwright or Cypress for critical user flows
