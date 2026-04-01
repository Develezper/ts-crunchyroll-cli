# Guía De Equipo - Crunchyroll CLI (TypeScript)

## 1. Propósito

Construir una aplicación CRUD por consola inspirada en Crunchyroll, con TypeScript estricto, arquitectura modular y reglas de negocio claras.

La salida para usuario final en consola está en español.

## 2. Estado Real De La Aplicación

Módulos implementados:

- Users
- Categories
- Series
- Seasons
- Episodes

Funcionalidades implementadas:

- CRUD de Categories
- CRUD de Series + filtro por categoría
- CRUD de Seasons
- CRUD de Episodes
- Gestión administrativa de Users (listar, crear, actualizar, borrado lógico)
- Decorador activo para logging en servicios (`LogExecution`)

## 3. Arquitectura Actual (Real Del Repositorio)

```txt
src/
├── index.ts                            # Entry point + menú CLI por secciones
├── data.ts                             # Seed inicial de usuarios
├── domain/
│   ├── entities/                       # Modelos de dominio
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Series.ts
│   │   ├── Season.ts
│   │   ├── Episode.ts
│   │   └── index.ts
│   └── interfaces/                     # Contratos de repositorio
│       ├── UserRepository.ts
│       ├── CategoryRepository.ts
│       ├── SeriesRepository.ts
│       ├── SeasonRepository.ts
│       ├── EpisodeRepository.ts
│       └── index.ts
├── application/
│   └── services/                       # Reglas de negocio y validaciones
│       ├── UserService.ts
│       ├── CategoryService.ts
│       ├── SeriesService.ts
│       ├── SeasonService.ts
│       ├── EpisodeService.ts
│       └── index.ts
├── infrastructure/
│   ├── database/
│   │   ├── inMemoryDb.ts               # Tablas en memoria
│   │   └── index.ts
│   └── repositories/                   # Implementación de contratos
│       ├── InMemoryUserRepository.ts
│       ├── InMemoryCategoryRepository.ts
│       ├── InMemorySeriesRepository.ts
│       ├── InMemorySeasonRepository.ts
│       ├── InMemoryEpisodeRepository.ts
│       └── index.ts
├── presentation/
│   ├── controllers/                    # Orquestación de casos de uso
│   │   ├── BaseController.ts
│   │   ├── UserController.ts
│   │   ├── CategoryController.ts
│   │   ├── SeriesController.ts
│   │   ├── SeasonEpisodeController.ts
│   │   └── index.ts
│   └── views/                          # Formato de salida en consola
│       ├── CommonView.ts
│       ├── UserView.ts
│       ├── CategoryView.ts
│       ├── SeriesView.ts
│       ├── SeasonEpisodeView.ts
│       └── index.ts
└── shared/
    ├── decorators/
    │   ├── LogExecution.ts
    │   └── index.ts
    ├── errors/
    │   ├── AppErrors.ts                # NotFoundError, ValidationError, AuthorizationError
    │   └── index.ts
    └── utils/
        └── index.ts                    # generateId, generarId, setGenerarId, validarAdmin
```

Dirección de dependencias:

- `presentation -> application -> domain`
- `infrastructure -> domain`
- `shared` se usa de forma transversal

## 4. Reglas De Negocio Implementadas

- Category: nombre obligatorio y único.
- Series: requiere `categoryId` válido.
- Season: requiere `seriesId` válido.
- Episode: requiere `seasonId` válido.
- Números de temporada/episodio mayores a 0.
- Duración de episodio mayor a 0.
- No se puede eliminar una categoría con series asociadas.
- No se permiten números duplicados:
  - temporada repetida dentro de la misma serie
  - episodio repetido dentro de la misma temporada
- Borrado en cascada:
  - al eliminar season se eliminan sus episodes
  - al eliminar series se eliminan sus seasons y episodes
- Operaciones administrativas de users protegidas por rol `ADMIN`.

## 5. Roles Del Equipo (3 Devs)

## 5.1 Dev 1 - Users

Responsabilidad principal:

- Capa completa de users (dominio, servicio, repositorio, controller, view).
- Validaciones de usuarios.
- Permisos por rol (`ADMIN`).
- Borrado lógico.

Archivos foco:

- `src/domain/entities/User.ts`
- `src/domain/interfaces/UserRepository.ts`
- `src/application/services/UserService.ts`
- `src/infrastructure/repositories/InMemoryUserRepository.ts`
- `src/presentation/controllers/UserController.ts`
- `src/presentation/views/UserView.ts`
- `src/data.ts`
- `src/index.ts` (opciones `21` a `24`)

## 5.2 Dev 2 - Categories + Series

Responsabilidad principal:

- CRUD de categorías y series.
- Integridad entre series y categorías.
- Filtro de series por categoría.
- Reglas de eliminación de categoría.

Archivos foco:

- `src/domain/entities/Category.ts`
- `src/domain/entities/Series.ts`
- `src/domain/interfaces/CategoryRepository.ts`
- `src/domain/interfaces/SeriesRepository.ts`
- `src/application/services/CategoryService.ts`
- `src/application/services/SeriesService.ts`
- `src/infrastructure/repositories/InMemoryCategoryRepository.ts`
- `src/infrastructure/repositories/InMemorySeriesRepository.ts`
- `src/presentation/controllers/CategoryController.ts`
- `src/presentation/controllers/SeriesController.ts`
- `src/presentation/views/CategoryView.ts`
- `src/presentation/views/SeriesView.ts`
- `src/index.ts` (opciones `1` a `11`)

## 5.3 Dev 3 - Seasons + Episodes

Responsabilidad principal:

- CRUD de temporadas y episodios.
- Integridad entre seasons, episodes y series.
- Validaciones de número/duración.
- Borrado en cascada y consistencia de relaciones.

Archivos foco:

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
- `src/index.ts` (opciones `12` a `20`)

## 5.4 Archivos Compartidos (coordinación de los 3)

- `src/index.ts` (orquestación de menú por secciones y wiring)
- `src/presentation/controllers/BaseController.ts`
- `src/presentation/views/CommonView.ts`
- `src/shared/decorators/LogExecution.ts`
- `src/shared/errors/AppErrors.ts`
- `src/shared/utils/index.ts`
- `README.md`
- `SUSTENTACION.md`
- `TEAM_GUIDE_CRUD_CRUNCHYROLL.md`

## 6. Relación Con Los Requisitos Técnicos

Requisito: arquitectura modular `src/`  
Estado: cumplido por capas (`domain`, `application`, `infrastructure`, `presentation`, `shared`).

Requisito: usar clases TypeScript  
Estado: cumplido en entidades, servicios, repositorios, controladores y views.

Requisito: aplicar decorador  
Estado: cumplido con `@LogExecution` en servicios.

Requisito: tipado estricto, cero `any`  
Estado: cumplido (`strict: true` + código sin `any` en `src`).

Requisito: separar responsabilidades  
Estado: cumplido (datos, lógica de negocio, persistencia, presentación y entrypoint separados).

## 7. Notas Sobre Namespaces

En este proyecto no usamos `namespace`; usamos módulos ES (`import/export`), que es la práctica recomendada en TypeScript moderno para apps Node por capas.

## 8. Estándares De Calidad Del Equipo

- No usar `any`.
- Mantener controladores delgados (sin lógica de negocio).
- Mantener la lógica de negocio en services.
- Mantener repositorios enfocados en persistencia.
- Mantener views enfocadas en salida de consola.
- Evitar duplicación de reglas de negocio.

## 9. Ejecución Y Validación

Ejecutar app:

```bash
bun run src/index.ts
```

Validar tipado:

```bash
npx tsc --noEmit
```

## 10. Checklist De Entrega

- La app ejecuta en consola sin errores.
- CRUD funcional por cada módulo.
- Reglas de negocio principales verificadas.
- Arquitectura por capas respetada.
- Tipado estricto sin `any`.
- Cada Dev domina y puede explicar su bloque de archivos.
