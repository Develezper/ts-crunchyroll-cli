# Guia de Proyecto - CRUD Crunchyroll CLI (Clean Architecture)

Esta guia define exactamente como trabajar el proyecto, quien hace cada modulo y que archivo toca cada persona.

## 1. Contexto y objetivo

Vamos a construir un CRUD por consola en TypeScript para un dominio tipo Crunchyroll.
La app debe estar bien separada por capas, con tipado estricto, clases, decorador y salida en espanol.

## 2. Estructura oficial del proyecto

```txt
src/
├── index.ts
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

## 3. Estado actual del repo

Implementado:

- Modulo categorias: entidad, contrato, servicio, repositorio, controlador y vista.
- Modulo temporadas/episodios: entidad, contrato, servicio, repositorio, controlador y vista.
- Base compartida: errores, utilidades y decorador de log.

Pendiente:

- Modulo usuarios.
- Modulo series.
- Integracion completa de menu CRUD interactivo.

## 4. Reglas del proyecto

- No usar `any`.
- La logica de negocio va en `application/services`.
- Las consultas/datos van en `infrastructure/repositories`.
- Las vistas solo muestran informacion (sin reglas de negocio).
- Mensajes de consola en espanol.
- Minimo un decorador aplicado a metodos de servicio.

## 5. Roles del equipo (3 personas por dominio)

- Dev 1: Usuarios.
- Dev 2: Series y Categorias.
- Dev 3: Temporadas y Episodios.

## 6. Tareas exactas por rol y archivo

### Dev 1 - Usuarios

| Archivo | Tarea |
|---|---|
| `src/domain/entities/User.ts` | Clase `User` (`id`, `name`, `email`, `favorites`). |
| `src/domain/interfaces/UserRepository.ts` | Contrato CRUD + favoritos. |
| `src/application/services/UserService.ts` | CRUD + validaciones de usuario. |
| `src/infrastructure/repositories/InMemoryUserRepository.ts` | Implementacion in-memory de usuarios. |
| `src/presentation/controllers/UserController.ts` | Flujo de acciones CLI de usuarios. |
| `src/presentation/views/UserView.ts` | Render de usuarios en consola (espanol). |
| `src/infrastructure/database/inMemoryDb.ts` | Agregar seed de usuarios. |

### Dev 2 - Series y Categorias

| Archivo | Tarea |
|---|---|
| `src/domain/entities/Series.ts` | Clase `Series` (`id`, `title`, `categoryId`, `seasonIds`). |
| `src/domain/entities/Category.ts` | Mantener y extender reglas de categoria si aplica. |
| `src/domain/interfaces/SeriesRepository.ts` | Contrato CRUD + filtro por categoria. |
| `src/domain/interfaces/CategoryRepository.ts` | Mantener contrato CRUD de categorias. |
| `src/application/services/SeriesService.ts` | CRUD de series + validaciones. |
| `src/application/services/CategoryService.ts` | Mantener y mejorar validaciones de categoria. |
| `src/infrastructure/repositories/InMemorySeriesRepository.ts` | Implementacion in-memory de series. |
| `src/infrastructure/repositories/InMemoryCategoryRepository.ts` | Mantener repo de categorias. |
| `src/presentation/controllers/SeriesController.ts` | Acciones CLI de series/categorias. |
| `src/presentation/views/SeriesView.ts` | Render de series/categorias en espanol. |
| `src/infrastructure/database/inMemoryDb.ts` | Agregar seed de series. |

### Dev 3 - Temporadas y Episodios

| Archivo | Tarea |
|---|---|
| `src/domain/entities/Season.ts` | Mantener entidad de temporada y su relacion con serie. |
| `src/domain/entities/Episode.ts` | Mantener entidad de episodio. |
| `src/domain/interfaces/SeasonRepository.ts` | Mantener contrato CRUD de temporada. |
| `src/domain/interfaces/EpisodeRepository.ts` | Mantener contrato CRUD de episodio. |
| `src/application/services/SeasonService.ts` | Mantener CRUD de temporada + validaciones. |
| `src/application/services/EpisodeService.ts` | Mantener CRUD de episodio + validaciones. |
| `src/infrastructure/repositories/InMemorySeasonRepository.ts` | Mantener repo in-memory de temporadas. |
| `src/infrastructure/repositories/InMemoryEpisodeRepository.ts` | Mantener repo in-memory de episodios. |
| `src/presentation/controllers/SeasonEpisodeController.ts` | Mantener flujo CLI de temporadas/episodios. |
| `src/presentation/views/SeasonEpisodeView.ts` | Mantener render en espanol. |
| `src/infrastructure/database/inMemoryDb.ts` | Mantener y ajustar seeds relacionados. |

## 7. Archivos compartidos (integracion conjunta)

| Archivo | Objetivo |
|---|---|
| `src/index.ts` | Composicion final y arranque del flujo de consola. |
| `src/shared/decorators/LogExecution.ts` | Decorador comun de logging. |
| `src/shared/errors/*` | Errores de aplicacion reutilizables. |
| `src/shared/utils/*` | Helpers comunes (ej. `generateId`). |
| `README.md` | Documentacion tecnica corta. |
| `TEAM_GUIDE_CRUD_CRUNCHYROLL.md` | Plan de ejecucion del equipo. |

## 8. Checklist de entrega

- CRUD de usuarios completo.
- CRUD de series/categorias completo.
- CRUD de temporadas/episodios completo.
- Decorador aplicado al menos en un metodo de servicio.
- Compila con `npx tsc --noEmit`.
- Flujo por consola con mensajes en espanol.
