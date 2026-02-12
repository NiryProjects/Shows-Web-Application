# Research Notes

## External APIs

### CollectAPI IMDB

- **Search:** `GET https://api.collectapi.com/imdb/imdbSearchByName?query=<term>`
- **Details:** `GET https://api.collectapi.com/imdb/imdbSearchById?movieId=<id>`
- **Auth:** Header `Authorization: apikey <key>`
- **Used in:** `controllers/shows.ts`

### Exchange Rate API

- **URL:** `https://open.er-api.com/v6/latest/USD`
- **Used in:** `controllers/testing.ts` (test-only polling endpoint)

## Angular Patterns Used

- **Subject + asObservable:** Services expose state via `Subject.asObservable()` instead of BehaviorSubject
- **HTTP Interceptors:** `AuthInterceptor` (token injection), `ErrorInterceptor` (global error dialog)
- **Route Guards:** `CanActivate` class-based (deprecated, needs functional migration)
- **Lazy Loading:** Auth module is lazy-loaded via `loadChildren`

## Mongoose Patterns

- **Embedded array:** Friends use embedded subdocument array (not a separate collection per friend)
- **ObjectId refs:** Show.creator and Friend.usernameId reference User collection
- **No middleware hooks:** No pre/post save hooks used
- **No virtuals or statics:** Only basic CRUD via controller logic
