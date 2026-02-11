# Tech Stack

## Current Versions

| Technology       | Version    | Latest (2026) | Status            |
| ---------------- | ---------- | ------------- | ----------------- |
| Angular          | ^16.0.0    | 19.x          | 🔴 3 major behind |
| Angular Material | ^16.0.1    | 19.x          | 🔴 3 major behind |
| TypeScript       | ~5.0.2     | 5.7+          | 🟡 Minor behind   |
| RxJS             | ~7.8.0     | 7.8.x         | ✅ Current        |
| Express          | ^4.18.2    | 5.x           | 🟡 1 major behind |
| Mongoose         | ^7.1.0     | 8.x           | 🟡 1 major behind |
| Node.js          | Not pinned | 22.x LTS      | ⚠️ Unknown        |
| jsonwebtoken     | ^9.0.0     | 9.x           | ✅ Current        |
| bcrypt           | ^5.1.0     | 5.x           | ✅ Current        |
| Karma/Jasmine    | ~6.4/~4.6  | —             | 🔴 Deprecated     |

## Deprecated Patterns in Codebase

| Pattern             | File            | Replacement                   |
| ------------------- | --------------- | ----------------------------- |
| `body-parser`       | `app.js`        | `express.json()`              |
| `useNewUrlParser`   | `connectDb.js`  | Remove (no-op in Mongoose 7+) |
| `CanActivate` class | `auth.guard.ts` | `CanActivateFn`               |
| `HttpClientModule`  | `app.module.ts` | `provideHttpClient()`         |
| NgModules           | All components  | Standalone components         |
| Karma test runner   | `package.json`  | Jest or Web Test Runner       |

## External APIs

- **CollectAPI IMDB** — Show search and metadata (`imdbSearchByName`, `imdbSearchById`)
- **Gmail SMTP** — Password reset emails via nodemailer
- **Exchange Rate API** — Test endpoint only (`open.er-api.com`)
