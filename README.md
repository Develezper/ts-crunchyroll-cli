# ts-crunchyroll-cli

Console CRUD project in TypeScript, structured with Clean Architecture principles.

## Current Architecture

```txt
src/
├── index.ts
├── data.ts
├── domain/
│   ├── entities/
│   │   ├── Category.ts
│   │   ├── Episode.ts
│   │   ├── Season.ts
│   │   ├── Series.ts
│   │   ├── User.ts
│   │   └── index.ts
│   └── interfaces/
│       ├── CategoryRepository.ts
│       ├── EpisodeRepository.ts
│       ├── SeasonRepository.ts
│       ├── SeriesRepository.ts
│       ├── UserRepository.ts
│       └── index.ts
├── application/
│   └── services/
│       ├── CategoryService.ts
│       ├── EpisodeService.ts
│       ├── SeasonService.ts
│       ├── UserService.ts
│       └── index.ts
├── infrastructure/
│   ├── database/
│   │   ├── inMemoryDb.ts
│   │   └── index.ts
│   └── repositories/
│       ├── InMemoryCategoryRepository.ts
│       ├── InMemoryEpisodeRepository.ts
│       ├── InMemorySeasonRepository.ts
│       ├── InMemoryUserRepository.ts
│       ├── JsonUserRepository.ts
│       └── index.ts
├── presentation/
│   ├── controllers/
│   │   ├── CategoryController.ts
│   │   ├── SeasonEpisodeController.ts
│   │   ├── UserController.ts
│   │   └── index.ts
│   └── views/
│       ├── CategoryView.ts
│       ├── CommonView.ts
│       ├── SeasonEpisodeView.ts
│       ├── UserView.ts
│       └── index.ts
└── shared/
    ├── decorators/
    │   ├── LogExecution.ts
    │   └── index.ts
    ├── errors/
    │   ├── ValidationError.ts
    │   ├── NotFoundError.ts
    │   └── index.ts
    └── utils/
        ├── auth.ts
        ├── generateId.ts
        └── index.ts
```

## Current Status

- Implemented: `users`, `categories`, `seasons`, `episodes` (with services, repos, controllers, and views).
- Pending: complete `series` service/repository/controller/view and integrate a full interactive CRUD menu in `index.ts`.

## Language Rule

- User-facing CLI output must be in Spanish.
- Code and file names can stay in English.

## Commands

```bash
bun run src/index.ts
```

```bash
npx tsc --noEmit
```

## Team Guide

Project planning, ownership, and per-file responsibilities:

- `TEAM_GUIDE_CRUD_CRUNCHYROLL.md`
