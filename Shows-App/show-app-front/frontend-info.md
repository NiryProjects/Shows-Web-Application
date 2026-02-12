# Frontend — Shows App

## Overview

Angular 16 SPA with Angular Material UI. Manages user authentication, personal show library, friend-based show comparison, and a rating guessing game.

## Tech Stack

- **Framework:** Angular `^16.0.0`
- **UI Library:** Angular Material `^16.0.1` + CDK `^16.0.1`
- **State/Reactivity:** RxJS `~7.8.0` (Subject-based listeners)
- **Language:** TypeScript `~5.0.2`
- **Testing:** Karma `~6.4.0` + Jasmine `~4.6.0` (deprecated in Angular 17+)

## Architecture

NgModule-based (not standalone components):

```
src/app/
├── app.module.ts              # Root module — all declarations
├── models/                    # **[NEW]** Centralized strict models
│   ├── auth.model.ts          # AuthData, AuthResponse
│   ├── show.model.ts          # Show interface
│   └── movie-static.model.ts  # Static game data interface
├── auth/                      # Login, Signup (Strictly typed)
│   ├── auth.service.ts        # JWT auth (Typed API calls)
...
├── all-shows/                 # Show library management
│   ├── shows.service.ts       # CRUD operations (Public `shows` array)
│   ├── show.model.ts          # **[DELETED]** Moved to src/app/models/
...
├── friends/                   # Friend management
│   ├── friends.service.ts     # Dynamic identity (localStorage lookup)
...
```

## Key Patterns

- **Auth:** JWT stored in `localStorage` with auto-expiry via `setTimeout`
- **HTTP:** `AuthInterceptor` adds Bearer token; `ErrorInterceptor` shows MatDialog on errors
- **State:** Services use `Subject` + `.asObservable()` pattern for component communication
- **Routing:** Mix of guarded (AuthGuard) and unguarded routes
- **API Base:** `environment.apiUrl = "http://localhost:3000/api"`

## Known Issues

- `CanActivate` class is deprecated → migrate to `CanActivateFn`
- `HttpClientModule` → migrate to `provideHttpClient()`
- `BrowserAnimationsModule` imported twice in `app.module.ts`
- AuthGuard removed from change-password and settings routes (testing leftover)
- Karma/Jasmine deprecated in Angular 17+ → migrate to Jest
- All components use NgModules → should migrate to standalone
