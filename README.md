# ts-crunchyroll-cli

Console CRUD project in TypeScript, structured with Clean Architecture principles.

## Current Architecture

```txt
src/
├── index.ts
├── domain/
│   ├── entities/
│   │   ├── Category.ts
│   │   ├── Season.ts
│   │   ├── Episode.ts
│   │   └── index.ts
│   └── interfaces/
│       ├── CategoryRepository.ts
│       ├── SeasonRepository.ts
│       ├── EpisodeRepository.ts
│       └── index.ts
├── application/
│   └── services/
│       ├── CategoryService.ts
│       ├── SeasonService.ts
│       ├── EpisodeService.ts
│       └── index.ts
├── infrastructure/
│   ├── database/
│   │   ├── inMemoryDb.ts
│   │   └── index.ts
│   └── repositories/
│       ├── InMemoryCategoryRepository.ts
│       ├── InMemorySeasonRepository.ts
│       ├── InMemoryEpisodeRepository.ts
│       └── index.ts
├── presentation/
│   ├── controllers/
│   │   ├── CategoryController.ts
│   │   ├── SeasonEpisodeController.ts
│   │   └── index.ts
│   └── views/
│       ├── CommonView.ts
│       ├── CategoryView.ts
│       ├── SeasonEpisodeView.ts
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
        ├── generateId.ts
        └── index.ts
```

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
