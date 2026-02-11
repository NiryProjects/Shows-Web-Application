# Backend — Shows API

## Overview

Express 4.18 REST API with Mongoose 7.1 (MongoDB Atlas). Handles auth, show library CRUD, friend management, and a static show-rating game.

## Tech Stack

- **Runtime:** Node.js (no version pinned)
- **Framework:** Express `^4.18.2`
- **ORM:** Mongoose `^7.1.0`
- **Auth:** bcrypt `^5.1.0` + jsonwebtoken `^9.0.0` (JWT, 1hr TTL)
- **Email:** nodemailer `^6.9.3` (Gmail SMTP)
- **HTTP:** axios `^1.4.0` (CollectAPI IMDB calls)

## Architecture

MVC-like structure (no views — JSON API only):

```
Shows-Api/
├── server.js          # HTTP server (port 3000)
├── app.js             # Express setup, middleware, route mounting
├── connectDb.js       # MongoDB Atlas connection
├── configToEnv.js     # Loads config.js → process.env
├── config/config.js   # ⚠️ Hardcoded secrets
├── validators.js      # Email, username, password validation
├── sendmail.js        # Gmail SMTP for password reset
├── makePassword.js    # Random password generator
├── dataObj.js         # Static Top 250 IMDB data (269KB)
├── models/            # Mongoose schemas (User, Show, Friend)
├── controllers/       # Business logic (user, shows, friend, showsGame, testing)
├── routes/            # Express route definitions
└── middleware/        # check-auth (JWT), my-tests-middleware (request logger)
```

## API Routes

| Route                              | Auth  | Methods          | Purpose                    |
| ---------------------------------- | ----- | ---------------- | -------------------------- |
| `/api/health`                      | No    | GET              | Health check               |
| `/api/user/signup`                 | No    | POST             | User registration          |
| `/api/user/login`                  | No    | POST             | Login → JWT                |
| `/api/user/changepassword`         | No ⚠️ | POST             | Change password            |
| `/api/user/forgotpassword`         | No    | POST             | Email new password         |
| `/api/shows/`                      | JWT   | GET, POST        | List/create user shows     |
| `/api/shows/:apiId`                | JWT   | GET, PUT, DELETE | Single show CRUD           |
| `/api/shows/search/:searchShow`    | JWT   | GET              | IMDB search via CollectAPI |
| `/api/friends/`                    | JWT   | GET              | List friends               |
| `/api/friends/search/:friendname`  | JWT   | GET              | Search user by username    |
| `/api/friends/:friendname`         | JWT   | POST             | Add friend                 |
| `/api/friends/:friendId`           | JWT   | GET              | Friend's show list         |
| `/api/friends/joint/:friendId`     | JWT   | GET              | Shows in common            |
| `/api/friends/different/:friendId` | JWT   | GET              | Shows not in common        |
| `/api/showsgame/tv`                | No    | GET              | Static Top 250 TV          |
| `/api/showsgame/movies`            | No    | GET              | Static Top 250 Movies      |
| `/api/test/*`                      | Mixed | GET              | Debug/test endpoints       |

## Known Issues

- `body-parser` is deprecated — use `express.json()` instead
- Mongoose `useNewUrlParser`/`useUnifiedTopology` are no-ops in v7+
- `uniqueValidator: true` in User model does nothing (not a real Mongoose option)
- No unique DB index on `email` or `username`
- Test middleware logs request bodies (including passwords) to console
