# Backend — Shows API

## Overview

Express 4.18 REST API in **100% TypeScript** with Mongoose 7.1. Handles auth, show library CRUD, friend management, and a static show-rating game.

## Tech Stack

- **Runtime:** Node.js (TypeScript via `ts-node` / `ts-node-dev`)
- **Framework:** Express `^4.18.2`
- **ORM:** Mongoose `^7.1.0`
- **Auth:** bcrypt `^5.1.0` + jsonwebtoken `^9.0.0`
- **Email:** nodemailer `^6.9.3`
- **HTTP:** axios `^1.4.0`

## Architecture

Modern TypeScript structure with strong typing and ESM imports:

```
Shows-Api/
├── src/
│   ├── server.ts          # Entry point (port 3000)
│   ├── app.ts             # Express setup & route mounting
│   ├── connectDb.ts       # MongoDB connection logic
│   ├── data/
│   │   ├── dataObj.ts     # Static Top 250 data (Migrated from JS)
│   │   └── staticData.ts  # Typed data exports
│   ├── utils/
│   │   ├── emailService.ts
│   │   ├── passwordGenerator.ts
│   │   └── validators.ts
│   └── types/             # Custom type definitions (Express, etc.)
├── models/                # Mongoose Models (TS)
├── controllers/           # Business Logic (TS)
├── routes/                # Express Routes (TS)
└── middleware/            # Custom Middleware (TS)
```

## API Routes

| Route                              | Auth | Methods          | Purpose                    |
| ---------------------------------- | ---- | ---------------- | -------------------------- |
| `/api/health`                      | No   | GET              | Health check               |
| `/api/user/signup`                 | No   | POST             | User registration          |
| `/api/user/login`                  | No   | POST             | Login → JWT                |
| `/api/user/changepassword`         | JWT  | POST             | Change password            |
| `/api/user/forgotpassword`         | No   | POST             | Email new password         |
| `/api/shows/`                      | JWT  | GET, POST        | List/create user shows     |
| `/api/shows/:apiId`                | JWT  | GET, PUT, DELETE | Single show CRUD           |
| `/api/shows/search/:searchShow`    | JWT  | GET              | IMDB search via CollectAPI |
| `/api/friends/`                    | JWT  | GET              | List friends               |
| `/api/friends/search/:friendname`  | JWT  | GET              | Search user by username    |
| `/api/friends/:friendname`         | JWT  | POST             | Add friend                 |
| `/api/friends/:friendId`           | JWT  | GET              | Friend's show list         |
| `/api/friends/joint/:friendId`     | JWT  | GET              | Shows in common            |
| `/api/friends/different/:friendId` | JWT  | GET              | Shows not in common        |
| `/api/showsgame/tv`                | No   | GET              | Static Top 250 TV          |
| `/api/showsgame/movies`            | No   | GET              | Static Top 250 Movies      |

## Development Scripts

- `npm start`: Run production server.
- `npm run dev`: Hot-reloading development server.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run lint`: Codebase-wide type check.
