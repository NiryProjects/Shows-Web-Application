# Shows Web Application

A full-stack web app for managing a personal TV show and movie library, comparing collections with friends, and playing a show-rating guessing game.

## Tech Stack

| Layer    | Technology           | Version       |
| -------- | -------------------- | ------------- |
| Frontend | Angular + Material   | 16.0          |
| Backend  | Express + TypeScript | 4.18 (Strict) |
| Database | MongoDB Atlas        | Mongoose 7.1  |
| Auth     | JWT + bcrypt         | 1hr token TTL |

## Features

- **User Auth** — Signup, login, change password, forgot password (email reset)
- **Show Library** — Search IMDB, add shows/movies, rate, review, delete
- **Friends** — Search users, add friends, view their shows
- **Compare Shows** — See shows in common (joint) or unique to each user (different)
- **Shows Game** — Higher/Lower guessing game with Top 250 ratings

## Project Structure

```
Shows-Web-Application/
├── Shows-Api/         # Express TS REST API (port 3000)
│   ├── src/           # TS Source code
│   ├── routes/        # TS Route handlers
│   └── controllers/   # TS Business logic
├── Shows-App/         # Angular SPA (ng serve)
├── docs/              # Project documentation
└── SYSTEM_SNAPSHOT.md # Full technical audit
```

## Quick Start

```bash
# Backend
cd Shows-Api
npm install
npm start             # Runs ts-node src/server.ts
```

# Frontend

cd Shows-App/show-app-front
npm install
npm start # (Runs ng serve on port 4200)

## Recent Updates

- **Strict Typing**: Frontend services now use strict TypeScript models (no `any`).
- **Identity Fix**: Resolved stale identity bugs in FriendsService.

```

## Documentation

- [SYSTEM_SNAPSHOT.md](./SYSTEM_SNAPSHOT.md) — Full technical due diligence report
- [Backend Info](./Shows-Api/backend-info.md) — API routes and architecture
- [Frontend Info](./Shows-App/show-app-front/frontend-info.md) — Angular structure
- [Security Analysis](./docs/security/security-analysis.md) — Security risks
```
