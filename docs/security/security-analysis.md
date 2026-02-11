# Security Analysis

## 🔴 Critical Issues

| #   | Issue                                                           | File                                | Fix                                               |
| --- | --------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| 1   | Hardcoded MongoDB password, JWT secret, Gmail password, API key | `config/config.js`                  | Move to `.env` + `dotenv`, rotate all credentials |
| 2   | JWT secret is guessable (`"secret_this_should_be_longer"`)      | `config/config.js:5`                | Use 256-bit random secret                         |
| 3   | DB credentials logged to console on startup                     | `connectDb.js:9,13`                 | Remove console.log calls                          |
| 4   | Wildcard CORS (`Access-Control-Allow-Origin: *`)                | `app.js:32`                         | Restrict to frontend origin                       |
| 5   | Passwords logged to console                                     | `controllers/user.js:138`           | Remove console.log                                |
| 6   | Test middleware logs full request bodies (including passwords)  | `middleware/my-tests-middleware.js` | Remove from production routes                     |

## 🟡 High-Risk Issues

| #   | Issue                                                 | File                       | Fix                          |
| --- | ----------------------------------------------------- | -------------------------- | ---------------------------- |
| 7   | No rate limiting on any endpoint                      | All routes                 | Add `express-rate-limit`     |
| 8   | No NoSQL injection protection                         | All controllers            | Add `express-mongo-sanitize` |
| 9   | AuthGuard removed from change-password route          | `app-routing.module.ts:33` | Re-enable guard              |
| 10  | Friend's shows accessible without mutual friendship   | `routes/friends.js:18`     | Add friendship verification  |
| 11  | No unique DB index on email/username (race condition) | `models/user.js`           | Add `unique: true` + index   |
| 12  | No HTTPS                                              | `server.js`                | Use TLS or reverse proxy     |
| 13  | `uniqueValidator: true` does nothing                  | `models/user.js:4,6`       | Not a real Mongoose option   |

## Immediate Action Items

1. **Create `.env` file** with all secrets, add to `.gitignore`
2. **Delete `config/config.js`** from repo and Git history
3. **Rotate all credentials** — MongoDB, JWT, Gmail, API key are compromised
4. **Remove all `console.log`** calls that expose sensitive data
5. **Add rate limiting** — `npm install express-rate-limit`
