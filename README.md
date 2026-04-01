# ts-crunchyroll-cli

Console CRUD project in TypeScript inspired by Crunchyroll, organized in layers to separate domain, business logic, persistence, and presentation.

## Objective

Build a maintainable, strictly typed app that is easy to explain during project defense, meeting:

- Full console CRUD
- TypeScript classes
- Decorator usage (`LogExecution`)
- Strict typing (no `any`)
- Clear separation of responsibilities

## Architecture

```txt
src/
├── index.ts                      # entrypoint and sectioned CLI menu
├── data.ts                       # user seed data
├── domain/
│   ├── entities/                 # domain models
│   └── interfaces/               # repository contracts
├── application/
│   └── services/                 # business rules and validations
├── infrastructure/
│   ├── database/                 # in-memory tables
│   └── repositories/             # contract implementations
├── presentation/
│   ├── controllers/              # use-case orchestration
│   └── views/                    # console output formatting
└── shared/
    ├── decorators/               # cross-cutting decorators
    ├── errors/                   # shared typed errors
    └── utils/                    # shared utilities
```

## Entities and Modules

- Users
- Categories
- Series
- Seasons
- Episodes

## Key Business Rules

- Category: required and unique name.
- Series: must reference an existing Category.
- Season: must reference an existing Series.
- Episode: must reference an existing Season.
- Season/Episode number must be greater than 0.
- Episode duration must be greater than 0.
- You cannot delete a Category that still has related Series.
- Cascade delete:
  - deleting a Season deletes its Episodes
  - deleting a Series deletes its Seasons and Episodes
- User admin operations are restricted to `ADMIN` role.

## Functional Status (Quick Check)

Validated on `2026-03-31`:

- `npx tsc --noEmit` OK
- `bun run src/index.ts` OK
- Critical flows verified:
  - category deletion blocked when related series exist
  - duplicate season/episode numbers blocked by context
  - cascade delete from season -> episodes

## Language Rule

- Code and technical naming: English.
- End-user console output: Spanish.

## Run Project

```bash
bun run src/index.ts
```

When the app starts, you choose the session user from a list (no password prompt).

- `ADMIN` can use all options.
- `USER` can use functional modules, but admin user-management options are restricted (`21-24`).

## Type Check

```bash
npx tsc --noEmit
```

## Team Documentation

- Team guide: `TEAM_GUIDE_CRUD_CRUNCHYROLL.md`
- Defense script: `SUSTENTACION.md`
