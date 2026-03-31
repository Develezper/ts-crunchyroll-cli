# ts-crunchyroll-cli

Proyecto CRUD por consola en TypeScript inspirado en Crunchyroll, organizado con arquitectura por capas (estilo Clean Architecture).

## Objetivo

Construir una aplicación mantenible, tipada y explicable en sustentación, separando claramente dominio, servicios, persistencia y presentación.

## Arquitectura actual

```txt
src/
├── index.ts
├── data.ts
├── domain/
│   ├── entities/
│   └── interfaces/
├── application/
│   └── services/
├── infrastructure/
│   ├── database/
│   └── repositories/
├── presentation/
│   ├── controllers/
│   └── views/
└── shared/
    ├── decorators/
    ├── errors/
    └── utils/
```

## Estado actual

Implementado:

- users
- categories
- series
- seasons
- episodes

Todo el CRUD principal está disponible desde el menú interactivo en `src/index.ts`.

## Regla de idioma

- Código y nombres técnicos: inglés.
- Mensajes al usuario por consola: español.

## Comandos rápidos

```bash
bun run src/index.ts
```

```bash
npx tsc --noEmit
```

## Documentación del equipo

- Guía operativa completa: `TEAM_GUIDE_CRUD_CRUNCHYROLL.md`
