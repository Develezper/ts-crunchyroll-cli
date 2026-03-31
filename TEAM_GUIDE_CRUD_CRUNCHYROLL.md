# Team Guide - CRUD Crunchyroll CLI (TypeScript)

This document is the single source of truth for the team.
If there is any doubt about what to build, where to build it, or who owns it, this guide decides it.

---

## 1. Project Vision

Build a console CRUD app inspired by Crunchyroll with:

- clean structure by layers
- strict typing in TypeScript
- clear separation of responsibilities
- at least one decorator in use
- user-facing console messages in Spanish

This is not only about "making it work".
It must be understandable, explainable, and defendable in the final presentation.

---

## 2. Scope

### In scope

- Users module
- Categories module
- Series module
- Seasons and Episodes module
- Shared utilities, errors, decorator
- Console output and interaction flow

### Out of scope (unless there is extra time)

- Real DB integration (PostgreSQL, MySQL, etc.)
- HTTP API server
- Authentication with tokens
- Full automated test suite (manual tests are enough for delivery)

---

## 3. Architecture Rules

We use a Clean Architecture style:

- `domain`: entities and contracts (no framework/no IO)
- `application`: business rules and use cases
- `infrastructure`: persistence implementations
- `presentation`: controllers and views for CLI
- `shared`: cross-cutting concerns (errors, decorators, utils)

### Dependency rule

Allowed direction:

- `presentation -> application -> domain`
- `infrastructure -> domain`
- `shared` can be used by all layers

Not allowed:

- `domain` importing `infrastructure` or `presentation`
- `views` implementing business rules

---

## 4. Current Real Structure (Repository)

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
    │   ├── NotFoundError.ts
    │   ├── ValidationError.ts
    │   └── index.ts
    └── utils/
        ├── auth.ts
        ├── generateId.ts
        └── index.ts
```

---

## 5. Current Status

### Implemented

- Users module (entity + interface + service + repo + controller + view)
- Categories module (entity + interface + service + repo + controller + view)
- Seasons/Episodes module (entity + interface + service + repo + controller + view)
- Shared errors/decorator/utils

### Pending to complete

- Full Series flow in all layers:
  - `SeriesService.ts`
  - `InMemorySeriesRepository.ts`
  - `SeriesController.ts`
  - `SeriesView.ts`
- Full interactive CLI menu in `src/index.ts` (currently scripted demo)

---

## 6. Entity Model (Domain)

### User

Core fields:

- `id`
- `nombre`
- `email`
- `password`
- `rol` (`ADMIN` | `USER`)
- `favoritos[]`
- `historial[]`
- `activo`

### Category

Core fields:

- `id`
- `name`
- `description`

### Series

Core fields:

- `id`
- `title`
- `categoryId`
- `seasonIds[]` or equivalent relation

### Season

Core fields:

- `id`
- `seriesId`
- `number`
- `title`
- `episodeIds[]`

### Episode

Core fields:

- `id`
- `seasonId`
- `number`
- `title`
- `durationMin`

---

## 7. CRUD Matrix

| Module | Create | Read | Update | Delete | Status |
|---|---|---|---|---|---|
| Users | Yes | Yes | Yes | Yes (soft/hard) | Implemented |
| Categories | Yes | Yes | Yes | Yes | Implemented |
| Seasons | Yes | Yes | Yes | Yes | Implemented |
| Episodes | Yes | Yes | Yes | Yes | Implemented |
| Series | Pending | Partial | Pending | Pending | To finish |

---

## 8. Team Roles (3-dev setup)

- Dev 1: Users
- Dev 2: Series + Categories
- Dev 3: Seasons + Episodes

### Global rule

Each dev owns one domain module across layers, but integration files are shared.

---

## 9. File Ownership - Dev 1 (Users)

### Must own

- `src/domain/entities/User.ts`
- `src/domain/interfaces/UserRepository.ts`
- `src/application/services/UserService.ts`
- `src/infrastructure/repositories/InMemoryUserRepository.ts`
- `src/infrastructure/repositories/JsonUserRepository.ts`
- `src/presentation/controllers/UserController.ts`
- `src/presentation/views/UserView.ts`
- `src/data.ts` (users section)
- `data/users.json`

### Must deliver

- Complete CRUD for users
- Admin checks for privileged operations
- Favorites/history flows
- Spanish console messages

### Done criteria

- `tsc` passes
- login + create + list + update + delete works from CLI flow

---

## 10. File Ownership - Dev 2 (Series + Categories)

### Must own

- `src/domain/entities/Series.ts`
- `src/domain/entities/Category.ts`
- `src/domain/interfaces/SeriesRepository.ts`
- `src/domain/interfaces/CategoryRepository.ts`
- `src/application/services/SeriesService.ts` (create this)
- `src/application/services/CategoryService.ts`
- `src/infrastructure/repositories/InMemorySeriesRepository.ts` (create this)
- `src/infrastructure/repositories/InMemoryCategoryRepository.ts`
- `src/presentation/controllers/SeriesController.ts` (create this)
- `src/presentation/controllers/CategoryController.ts`
- `src/presentation/views/SeriesView.ts` (create this)
- `src/presentation/views/CategoryView.ts`

### Must deliver

- Full CRUD for series
- Category association validation
- Category list/filter support for series

### Done criteria

- Cannot create a series with invalid category
- Series list and filter by category works
- Update/delete paths are validated and handled

---

## 11. File Ownership - Dev 3 (Seasons + Episodes)

### Must own

- `src/domain/entities/Season.ts`
- `src/domain/entities/Episode.ts`
- `src/domain/interfaces/SeasonRepository.ts`
- `src/domain/interfaces/EpisodeRepository.ts`
- `src/application/services/SeasonService.ts`
- `src/application/services/EpisodeService.ts`
- `src/infrastructure/repositories/InMemorySeasonRepository.ts`
- `src/infrastructure/repositories/InMemoryEpisodeRepository.ts`
- `src/presentation/controllers/SeasonEpisodeController.ts`
- `src/presentation/views/SeasonEpisodeView.ts`

### Must deliver

- Full CRUD for seasons and episodes
- Relation checks (season belongs to series, episode belongs to season)
- Input validation (`number > 0`, `durationMin > 0`)

### Done criteria

- Create/update/delete season works
- Create/update/delete episode works
- Query by `seriesId` and `seasonId` works

---

## 12. Shared Integration Files (all 3 devs)

| File | Why shared |
|---|---|
| `src/index.ts` | Composition root + application startup flow |
| `src/application/services/index.ts` | Service exports |
| `src/infrastructure/repositories/index.ts` | Repository exports |
| `src/presentation/controllers/index.ts` | Controller exports |
| `src/presentation/views/index.ts` | View exports |
| `src/shared/decorators/LogExecution.ts` | Global method logging decorator |
| `src/shared/errors/*` | Shared domain/application errors |
| `src/shared/utils/*` | Shared helpers |
| `README.md` | Public technical overview |
| `TEAM_GUIDE_CRUD_CRUNCHYROLL.md` | Team operating guide |

### Shared rule

No one force-pushes or rewrites shared files without team sync.

---

## 13. Coding Standards

- Strict TypeScript (`no any`).
- Keep names consistent in English for code identifiers.
- Keep user-facing messages in Spanish.
- Add comments only when they explain architecture or non-obvious logic.
- Avoid dead code and duplicated logic.

---

## 14. Validation Standards

At minimum:

- Required strings must be trimmed and non-empty.
- IDs must be validated before mutation.
- Duplicate constraints must be checked where required (for example category name).
- Numeric domain values must be positive where applicable.

Error strategy:

- Use `ValidationError` for invalid input/business rule failures.
- Use `NotFoundError` for missing entities.

---

## 15. Decorator Requirement

Use `LogExecution` on important service methods (create/update/remove/login).

Goal:

- Show observable execution in console.
- Demonstrate decorator usage in presentation.

---

## 16. CLI Output Policy

- All final user messages in Spanish.
- Success and error messages must be explicit.
- Avoid dumping raw objects without formatting.

---

## 17. Implementation Flow (recommended order)

1. `domain` entities and contracts
2. `infrastructure` repositories and seed data
3. `application` services and validations
4. `presentation` controllers and views
5. `index.ts` composition and demo/menu flow
6. `tsc` + manual tests

---

## 18. Git Workflow

### Daily start

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch <tu-rama>
git pull --ff-only origin <tu-rama>
```

### Commit pattern

```bash
git add -A
git commit -m "feat: short clear description"
git push origin <tu-rama>
```

### Before merge

- Run `npx tsc --noEmit`
- Run local CLI demo
- Review changed files against ownership

---

## 19. Conflict Handling Protocol

If conflict appears:

1. Do not panic.
2. Identify file owner based on this guide.
3. Preserve current architecture layers.
4. Resolve with owner present if shared file.
5. Re-run `tsc` and smoke demo.

Never do destructive commands (`reset --hard`) without team agreement.

---

## 20. Manual Test Plan (minimum)

### Categories

- Create category with valid name
- Reject empty category name
- Reject duplicated category name
- Update existing category
- Delete existing category

### Seasons/Episodes

- Create season with valid number/title
- Reject season number <= 0
- Create episode with valid duration
- Reject episode duration <= 0
- List episodes by season

### Users

- Login success/failure
- Admin-only operation guard
- Add favorites/history
- Soft delete behavior

### Global

- No runtime crash in normal flow
- Console output is understandable and in Spanish

---

## 21. Presentation Script (for defense)

Suggested structure:

1. Explain architecture layers in 30-45 seconds.
2. Show one complete CRUD flow live (recommended: categories).
3. Show one cross-entity relation flow (recommended: season -> episodes).
4. Show decorator log output from service calls.
5. Mention strict typing and error strategy.

Key sentence:

"The project is organized with clean layer boundaries, where business rules live in services, persistence lives in repositories, and console interaction is isolated in presentation controllers/views."

---

## 22. Definition of Done (final)

Project is done only when all are true:

- Users CRUD works
- Categories CRUD works
- Series CRUD works
- Seasons/Episodes CRUD works
- At least one decorator is active in service methods
- `npx tsc --noEmit` passes
- Team guide and README are up to date
- Demo flow is reproducible from `src/index.ts`

---

## 23. Quick Commands

```bash
bun run src/index.ts
```

```bash
npx tsc --noEmit
```

---

## 24. Final Notes

- If code and guide disagree, update the guide in the same PR.
- Keep this document alive; it is part of the deliverable quality.
- Prefer clarity over cleverness.
