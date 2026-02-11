# PRD — Shows Web Application

## Purpose

A social TV/movie tracking app where users maintain a personal library of shows, rate and review them, add friends, and compare collections.

## Core Features

### 1. Authentication

- Signup with email, username, password (bcrypt hashed)
- Login → JWT (1hr TTL, stored in localStorage)
- Change password (requires current password)
- Forgot password (generates random password, emails via Gmail SMTP)

### 2. Show Library

- Search shows/movies via IMDB API (CollectAPI)
- Add to personal library with rating and review
- Auto-fetch metadata (seasons for TV, runtime for movies)
- Update rating/review, delete from library
- View individual show details

### 3. Friends

- Search users by username
- Add friend (unidirectional, instant — no accept flow)
- View friend's show library
- **Compare Shows:** Joint (intersection) and Different (symmetric difference)

### 4. Shows Game

- Higher/Lower guessing game using Top 250 TV/Movies ratings
- Uses static data (not live API)

## Missing/Planned Features

- [ ] Watch status (Watched / To Watch / Watching)
- [ ] Remove friend
- [ ] Bidirectional friendships
- [ ] Union shows comparison (code exists, route not wired)
- [ ] User profile / avatar
