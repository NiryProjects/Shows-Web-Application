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
├── app-routing.module.ts      # Route definitions + AuthGuard
├── error-interceptor.ts       # Global HTTP error → MatDialog
├── angular-material.module.ts # Material module barrel
├── auth/                      # Login, Signup, ChangePassword, ForgotPassword
│   ├── auth.service.ts        # JWT auth (localStorage storage)
│   ├── auth-interceptor.ts    # Attaches Bearer token to requests
│   ├── auth.guard.ts          # CanActivate route guard
│   └── auth.module.ts         # Lazy-loaded auth module
├── all-shows/                 # Show library management
│   ├── shows.service.ts       # CRUD operations via HttpClient
│   ├── show.model.ts          # Show interface
│   ├── clip.model.ts          # Clip interface (unused?)
│   ├── shows-list/            # Show grid view
│   ├── clip-create/           # Add new show (search + save)
│   ├── single-show-view*/     # Show detail views (user/friend variants)
│   └── show-list-only/        # Minimal list view
├── friends/                   # Friend management + show comparison
│   ├── friends.service.ts     # Friend CRUD + joint/different show queries
│   └── friends-*/             # Search, list, card, friend-shows components
├── shows-game/                # Higher/Lower rating game
├── header/                    # Navigation bar
├── settings/                  # User settings
├── info-page/                 # Landing page
└── myTest/                    # Dev test component
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
