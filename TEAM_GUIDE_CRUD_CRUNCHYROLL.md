# Team Guide - Crunchyroll CLI (TypeScript)

## 1. Purpose

Build a console CRUD app inspired by Crunchyroll with clean layering, strict TypeScript, and clear business rules.

Console output for end users is in Spanish.

## 2. Scope

Modules included:

- Users
- Categories
- Series
- Seasons
- Episodes

Core requirement:

- Full CRUD per module where applicable
- Clean separation of responsibilities
- At least one decorator in use (`LogExecution`)

## 3. Architecture

```txt
src/
├── index.ts                      # app entry + CLI orchestration
├── data.ts                       # seed users
├── domain/
│   ├── entities/                 # business models
│   └── interfaces/               # repository contracts
├── application/
│   └── services/                 # business logic + validations
├── infrastructure/
│   ├── database/                 # in-memory tables
│   └── repositories/             # contract implementations
├── presentation/
│   ├── controllers/              # use-case orchestration
│   └── views/                    # CLI output formatting
└── shared/
    ├── decorators/
    ├── errors/
    └── utils/
```

Dependency direction:

- `presentation -> application -> domain`
- `infrastructure -> domain`
- `shared` reusable across layers

## 4. What Is Implemented

- Categories: CRUD
- Series: CRUD + filter by category
- Seasons: CRUD + relation validation (`seriesId`)
- Episodes: CRUD + relation validation (`seasonId`)
- Cascade delete: removing a season removes its episodes
- Users: list/create/update/soft-delete with admin validation

## 5. Business Rules (Important)

- Category name is required and unique.
- Series must reference an existing category.
- Season must reference an existing series.
- Episode must reference an existing season.
- Episode number and duration must be greater than 0.
- Only admin can execute protected user operations.

## 6. Roles

- Dev 1: Users
- Dev 2: Categories + Series
- Dev 3: Seasons + Episodes

Shared integration files:

- `src/index.ts`
- barrel exports (`index.ts`) in services/repositories/controllers/views
- `shared/*`
- `README.md` and this guide

## 7. Quality Rules

- No `any`.
- No duplicated repository implementations.
- Keep controllers thin; business rules belong in services.
- Keep views focused on output formatting only.

## 8. Run & Validate

Run app:

```bash
bun run src/index.ts
```

Type-check:

```bash
npx tsc --noEmit
```

## 9. Delivery Checklist

- App runs from console without crashes.
- Main CRUD flows tested manually.
- Type-check passes.
- Code is understandable and maintainable.
