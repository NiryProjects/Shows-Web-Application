# Design Reference

## UI Framework

Angular Material 16 — pre-built components for forms, dialogs, cards, toolbars, spinners.

## Material Components Used

| Component            | Usage                               |
| -------------------- | ----------------------------------- |
| `MatToolbar`         | Header/navigation bar               |
| `MatCard`            | Show cards, friend cards            |
| `MatButton`          | All action buttons                  |
| `MatInput`           | Form fields (login, signup, search) |
| `MatDialog`          | Error popup (`ErrorComponent`)      |
| `MatProgressSpinner` | Loading indicators                  |
| `MatIcon`            | UI icons                            |
| `MatOption`          | Dropdown selections                 |

## Layout

- Single-page app with `<router-outlet>` in `app.component.html`
- Header is persistent across all routes
- No responsive breakpoint handling (desktop-oriented)
- Global styles in `src/styles.css` (minimal — 181 bytes)

## Component Views

- **InfoPage** — Landing page (default route `/`)
- **ShowsList** — Grid of user's saved shows
- **ClipCreate** — IMDB search + add show form
- **SingleShowView** — Show detail with rating/review (3 variants: generic, user, friend)
- **FriendsList** — Grid of friends
- **FriendsShowsList** — Friend's shows with joint/different toggle
- **ShowsGameHighlow** — Higher/Lower rating game
- **Settings** — User settings page
