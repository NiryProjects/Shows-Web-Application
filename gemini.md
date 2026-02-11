# Gemini Project Log

## 2026-02-11 — Technical Due Diligence Audit

- Created `SYSTEM_SNAPSHOT.md` — full architecture, schema, security, and modernization roadmap
- Populated all empty documentation files with relevant data
- Key decisions pending: Angular upgrade path (16→19), backend TypeScript migration, secrets management

## Modernization Priority

1. **Security** — Remove hardcoded credentials from `config/config.js`, rotate secrets
2. **DevEx** — Add `.env`, ESLint, proper dev scripts
3. **Backend** — Migrate to TypeScript, replace deprecated `body-parser`
4. **Frontend** — Angular 16→17→18→19, standalone components, functional guards
5. **Data Model** — Add unique indexes, show status field, fix friend model
