# ts-crunchyroll-cli

Base architecture for a console CRUD app in TypeScript, inspired by Clean Architecture and aligned with the activity requirements.

## Goal

Build a CRUD for one main entity (for example, `Series`) with strict typing, classes, decorators, and clear separation of responsibilities.

## Project Architecture

```txt
src/
├── index.ts                          # Entry point (composition and CLI bootstrap)
├── moduls.ts                         # Re-exports and reusable modules
├── services.ts                       # Service/use-case access point
├── data.ts                           # Mock data / in-memory seeds
│
├── domain/
│   ├── entities/
│   │   └── index.ts                  # Domain classes
│   └── interfaces/
│       └── index.ts                  # Contracts (repositories/ports)
│
├── application/
│   └── services/
│       └── index.ts                  # Use cases / application logic
│
├── infrastructure/
│   └── repositories/
│       └── index.ts                  # Concrete implementations (in-memory/JSON)
│
├── presentation/
│   ├── controllers/
│   │   └── index.ts                  # CLI flow orchestration
│   └── views/
│       └── index.ts                  # Console rendering
│
└── shared/
    ├── decorators/
    │   └── index.ts                  # Reusable decorators
    ├── errors/
    │   └── index.ts                  # Custom error types
    └── utils/
        └── index.ts                  # Helpers and utilities
```

## Layer Rules

- `domain`: no dependency on console, concrete repositories, or frameworks.
- `application`: uses domain contracts to execute use cases.
- `infrastructure`: implements contracts (for example, in-memory repository).
- `presentation`: receives input and shows output; no business rules.
- `shared`: cross-cutting reusable parts (decorators, errors, utils).

## Activity Requirements (Checklist)

- Full CRUD: Create, Read, Update, Delete.
- TypeScript classes to model entities.
- At least one decorator (class or method).
- Strict typing (no `any`).
- Console execution.
- Separation of responsibilities.

## Language Rule for CLI

- All user-facing CLI output (menus, prompts, success/error messages) must be in **Spanish**.
- Internal code, file names, and architecture docs remain in English.

## Recommended Implementation Flow

1. Define entities and contracts in `domain`.
2. Create initial typed data in `data.ts`.
3. Implement repositories in `infrastructure`.
4. Build use cases/services in `application`.
5. Wire everything through `services.ts` and `moduls.ts`.
6. Build CLI interaction in `presentation` and bootstrap in `index.ts`.

## Team Work Split Suggestion

- Person A: `domain` + contracts.
- Person B: `infrastructure` + `data.ts`.
- Person C: `application` + `services.ts`.
- Person D: `presentation` + main flow in `index.ts`.

## Useful Commands

```bash
bun run src/index.ts
```

```bash
npx tsc --noEmit
```

## Note

This scaffold is intentionally minimal: the goal is to guide the team with a clear structure before implementing the final logic.

## Team Guide

For planning, roles, delivery flow, and presentation support, check:

- `TEAM_GUIDE_CRUD_CRUNCHYROLL.md`
