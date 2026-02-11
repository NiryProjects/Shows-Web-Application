# Project Info

## MongoDB Schemas

**User:** `{ email, password (bcrypt hash), username }` — No unique index (bug)

**Show:** `{ creator (User ref), title, img, rating, review, type, seasons?, minutes?, apiId }` — Linked to user via `creator` ObjectId

**Friend:** `{ usernameId (User ref), friends: [{ friendUsername, friendId }] }` — One doc per user, embedded friends array, unidirectional

## Key Implementation Details

- **Show comparison** uses `title` string matching (not `apiId`) — fragile
- **Friend add** is one-way: User A adding User B doesn't mean B has A
- **Shows Game** uses a 269KB static `dataObj.js` file (not live IMDB data)
- **Password reset** generates 8-char random password, emails it, then updates DB
- **Auth token** is stored in `localStorage` (4 keys: token, expiration, userId, username)
