# Project Info

## MongoDB Schemas

**User:** `{ email, password (bcrypt hash), username }` — No unique index (bug)

**Show:** `{ creator (User ref), title, img, rating, review, type, seasons?, minutes?, apiId }` — Linked to user via `creator` ObjectId

**Friend:** `{ usernameId (User ref), friends: [{ friendUsername, friendId }] }` — One doc per user, embedded friends array, unidirectional

## Key Implementation Details

- **Show comparison** uses `title` string matching (not `apiId`) — fragile
- **Friend add** is one-way: User A adding User B doesn't mean B has A
- **Shows Game** uses a typed `dataObj.ts` as a static resource (270KB dataset)
- **Password reset** generates typed 8-char random password via `passwordGenerator.ts`
- **Password hashing** uses `bcrypt` in production and test environments.
- **Auth token** is stored in `localStorage` (4 keys: token, expiration, userId, username)
