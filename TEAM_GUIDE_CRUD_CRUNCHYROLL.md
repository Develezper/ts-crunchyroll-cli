# Guia de Proyecto - CRUD Crunchyroll CLI (TypeScript)

Este documento es la guia oficial del equipo para construir el proyecto.
Objetivo: que cualquier dev pueda entrar, entender el contexto y saber exactamente que hacer.

## 1. Contexto

El reto es construir un CRUD por consola en TypeScript, inspirado en una app tipo Crunchyroll.
La solucion debe demostrar buena arquitectura, tipado estricto y capacidad de sustentacion tecnica.

## 2. Objetivo del sistema

Implementar una aplicacion CLI que gestione:

- Usuarios
- Categorias
- Series
- Temporadas y episodios
- (Opcional) favoritos y valoraciones

Con operaciones CRUD:

- Create
- Read
- Update
- Delete

## 3. Requisitos obligatorios (rubrica)

- Arquitectura modular con separacion de responsabilidades.
- Uso de clases en TypeScript.
- Al menos un decorador.
- Tipado estricto (sin `any`).
- App ejecutable por consola.
- CRUD completo funcional.

## 4. Regla de idioma

- El codigo y la arquitectura pueden quedar en ingles.
- La salida de consola para usuario final debe estar en espanol (menus, prompts, mensajes, errores).

## 5. Arquitectura acordada

```txt
src/
├── index.ts                          # Entry point (composition + bootstrap)
├── moduls.ts                         # Re-exports / modulo central
├── services.ts                       # Wiring de servicios/casos de uso
├── data.ts                           # Datos mock iniciales
│
├── domain/
│   ├── entities/                     # Clases del dominio
│   └── interfaces/                   # Contratos/puertos
│
├── application/
│   └── services/                     # Casos de uso / logica de aplicacion
│
├── infrastructure/
│   └── repositories/                 # Implementaciones concretas de repos
│
├── presentation/
│   ├── controllers/                  # Flujo de interaccion de CLI
│   └── views/                        # Renderizado de consola
│
└── shared/
    ├── decorators/                   # Decoradores reutilizables
    ├── errors/                       # Errores custom
    └── utils/                        # Helpers
```

## 6. Flujo tecnico recomendado

1. `presentation` recibe una accion del usuario por consola.
2. `controller` valida input basico y llama al servicio.
3. `application/services` ejecuta reglas de negocio.
4. `infrastructure/repositories` persiste/consulta en memoria.
5. `views` imprime resultados en consola (en espanol).

## 7. Modelo funcional minimo

### Entidades base

- `User`: id, nombre, email, favoritos[]
- `Category`: id, nombre
- `Episode`: id, numero, titulo, duracionMin
- `Season`: id, numero, episodios[]
- `Series`: id, titulo, categoriaId, temporadas[]

### CRUD obligatorio minimo

- CRUD completo de `Series` (prioridad 1)
- CRUD basico de `Category` y `User` (prioridad 2)
- Operaciones de `Season` dentro de `Series` (prioridad 2)

## 8. Plan de implementacion por fases

### Fase 1 - Dominio y contratos

- Crear clases de entidades en `domain/entities`.
- Crear interfaces de repositorio en `domain/interfaces`.
- Definir tipos/DTOs para create/update.

Definition of Done:

- Entidades compilando.
- Contratos sin `any`.

### Fase 2 - Datos e infraestructura

- Definir seeds en `data.ts`.
- Implementar repositorios in-memory en `infrastructure/repositories`.
- Agregar busqueda por id y listados.

Definition of Done:

- Repos funcionando con pruebas manuales simples.

### Fase 3 - Servicios de aplicacion

- Implementar CRUD en `application/services`.
- Aplicar validaciones de negocio.
- Agregar errores custom (`NotFoundError`, `ValidationError`).
- Aplicar al menos un decorador (ejemplo: logger de metodos).

Definition of Done:

- CRUD completo de Series validado.
- Decorador activo.

### Fase 4 - Presentacion CLI

- Implementar menu principal en controlador.
- Implementar vistas legibles en `presentation/views`.
- Garantizar mensajes en espanol.

Definition of Done:

- Flujo E2E por consola funcionando.

### Fase 5 - Cierre y sustentacion

- Ajustar README final del proyecto.
- Preparar demo guiada (crear, listar, actualizar, eliminar).
- Preparar discurso tecnico corto.

Definition of Done:

- Equipo listo para exponer sin improvisar.

## 9. Roles sugeridos del equipo (3 personas, por dominio)

| Rol | Responsabilidad principal | Entregable |
|---|---|---|
| Dev 1 - Modulo Usuarios | CRUD de usuarios en todas las capas (domain, app, infra, presentation) | Modulo usuarios completo y probado |
| Dev 2 - Modulo Series y Categorias | CRUD de series/categorias y relacion entre ambas | Modulo series/categorias completo y probado |
| Dev 3 - Modulo Temporadas y Episodios | CRUD de temporadas/episodios y relacion con series | Modulo temporadas/episodios completo y probado |

Regla de trabajo:

- Cada dev es owner de su dominio en todas las capas.
- `src/index.ts`, `src/services.ts`, `src/moduls.ts` y `src/data.ts` se editan de forma coordinada.
- Si un cambio cruza dominios, se coordina por PR/revision antes de merge.

## 10. Reglas de calidad del codigo

- No usar `any`.
- Usar `Partial<T>` solo para updates.
- Validar entradas antes de mutar datos.
- Evitar logica de negocio dentro de `views`.
- Mantener funciones cortas y con nombres claros.
- Todo cambio debe ser revisable por otro miembro.

## 11. Aportes adicionales para destacar

Prioridad alta:

- Favoritos por usuario (`user.favoritos`).
- Filtro por categoria.
- Sistema de rating 1-5 por serie.
- Logger con decorador para operaciones CRUD.

Prioridad media:

- Roles `ADMIN` y `USER` (restriccion de delete para ADMIN).
- Persistencia a JSON (guardar/cargar estado).

Prioridad extra:

- Tests basicos de servicios.
- Comando de reporte: top series por rating.

## 12. Script de sustentacion (guia corta)

Frase propuesta:

"El sistema esta disenado con una arquitectura inspirada en Clean Architecture.
El dominio esta desacoplado de infraestructura mediante interfaces de repositorio,
la logica de negocio vive en servicios de aplicacion,
y la capa de presentacion maneja exclusivamente la interaccion por consola en espanol."

Puntos que deben mostrar en vivo:

1. Create de una serie.
2. Read (listar y buscar por id).
3. Update parcial con `Partial<T>`.
4. Delete con validacion.
5. Evidencia del decorador (log de ejecucion).

## 13. Comandos de trabajo

```bash
bun run src/index.ts
```

```bash
npx tsc --noEmit
```

## 14. Checklist final antes de entregar

- CRUD completo funcionando.
- Consola en espanol.
- Decorador implementado.
- Tipado estricto sin `any`.
- Estructura por capas respetada.
- README y guia de equipo actualizados.

## 15. Mapa exacto de archivos (que va en cada uno)

Esta seccion define la solucion esperada archivo por archivo.

### Archivos raiz de `src` (obligatorios)

- `src/index.ts`
Responsabilidad: entry point. Levanta dependencias y ejecuta el menu CLI.
No debe contener logica de negocio compleja.

- `src/moduls.ts`
Responsabilidad: re-exports centrales para simplificar imports.
Ejemplo: exportar controladores, servicios, errores y utilidades.

- `src/services.ts`
Responsabilidad: composition root de servicios/casos de uso.
Aqui se conectan interfaces + repositorios concretos.

- `src/data.ts`
Responsabilidad: seeds in-memory tipados (usuarios, categorias, series).
No meter reglas de negocio aqui.

### Dominio

- `src/domain/entities/User.ts`
- `src/domain/entities/Category.ts`
- `src/domain/entities/Episode.ts`
- `src/domain/entities/Season.ts`
- `src/domain/entities/Series.ts`
Responsabilidad: clases del dominio con propiedades y reglas basicas.

- `src/domain/interfaces/UserRepository.ts`
- `src/domain/interfaces/CategoryRepository.ts`
- `src/domain/interfaces/SeriesRepository.ts`
- `src/domain/interfaces/SeasonRepository.ts`
- `src/domain/interfaces/EpisodeRepository.ts`
Responsabilidad: contratos de persistencia (CRUD y consultas clave).

### Aplicacion

- `src/application/services/UserService.ts`
- `src/application/services/CategoryService.ts`
- `src/application/services/SeriesService.ts`
- `src/application/services/SeasonService.ts`
- `src/application/services/EpisodeService.ts`
Responsabilidad: logica de negocio, validaciones y casos de uso.
Aqui debe vivir el CRUD real.

### Infraestructura

- `src/infrastructure/repositories/InMemoryUserRepository.ts`
- `src/infrastructure/repositories/InMemoryCategoryRepository.ts`
- `src/infrastructure/repositories/InMemorySeriesRepository.ts`
- `src/infrastructure/repositories/InMemorySeasonRepository.ts`
- `src/infrastructure/repositories/InMemoryEpisodeRepository.ts`
Responsabilidad: implementaciones concretas de los contratos.

### Presentacion (CLI)

- `src/presentation/controllers/MainController.ts`
Responsabilidad: menu principal, routing de opciones y flujo.

- `src/presentation/controllers/UserController.ts`
- `src/presentation/controllers/SeriesController.ts`
- `src/presentation/controllers/SeasonEpisodeController.ts`
Responsabilidad: acciones CRUD por dominio desde input CLI.

- `src/presentation/views/UserView.ts`
- `src/presentation/views/SeriesView.ts`
- `src/presentation/views/SeasonEpisodeView.ts`
- `src/presentation/views/CommonView.ts`
Responsabilidad: imprimir datos y mensajes en consola (siempre en espanol).

### Compartido

- `src/shared/decorators/LogExecution.ts`
Responsabilidad: decorador para log de metodos CRUD.

- `src/shared/errors/NotFoundError.ts`
- `src/shared/errors/ValidationError.ts`
Responsabilidad: errores de dominio/aplicacion.

- `src/shared/utils/generateId.ts`
Responsabilidad: helper para IDs y utilidades puras.

## 16. Distribucion de trabajo por rol (equipo de 3, por dominio)

- Dev 1 - Usuarios
Archivos foco:
`src/domain/entities/User.ts`,
`src/domain/interfaces/UserRepository.ts`,
`src/application/services/UserService.ts`,
`src/infrastructure/repositories/InMemoryUserRepository.ts`,
`src/presentation/controllers/UserController.ts`,
`src/presentation/views/UserView.ts`.
Tambien actualiza su seccion en `src/data.ts`.
Tarea: CRUD completo de usuarios + favoritos de usuario.

- Dev 2 - Series y Categorias
Archivos foco:
`src/domain/entities/Series.ts`,
`src/domain/entities/Category.ts`,
`src/domain/interfaces/SeriesRepository.ts`,
`src/domain/interfaces/CategoryRepository.ts`,
`src/application/services/SeriesService.ts`,
`src/application/services/CategoryService.ts`,
`src/infrastructure/repositories/InMemorySeriesRepository.ts`,
`src/infrastructure/repositories/InMemoryCategoryRepository.ts`,
`src/presentation/controllers/SeriesController.ts`,
`src/presentation/views/SeriesView.ts`.
Tambien actualiza su seccion en `src/data.ts`.
Tarea: CRUD completo de series/categorias + filtros por categoria.

- Dev 3 - Temporadas y Episodios
Archivos foco:
`src/domain/entities/Season.ts`,
`src/domain/entities/Episode.ts`,
`src/domain/interfaces/SeasonRepository.ts`,
`src/domain/interfaces/EpisodeRepository.ts`,
`src/application/services/SeasonService.ts`,
`src/application/services/EpisodeService.ts`,
`src/infrastructure/repositories/InMemorySeasonRepository.ts`,
`src/infrastructure/repositories/InMemoryEpisodeRepository.ts`,
`src/presentation/controllers/SeasonEpisodeController.ts`,
`src/presentation/views/SeasonEpisodeView.ts`.
Tambien actualiza su seccion en `src/data.ts`.
Tarea: CRUD completo de temporadas/episodios e integracion con series.

Archivos compartidos (coordinados por los 3):

- `src/index.ts` (flujo principal del menu)
- `src/services.ts` (wiring/composicion de servicios)
- `src/moduls.ts` (re-exports)
- `src/shared/decorators/LogExecution.ts` (decorador obligatorio)
- `src/shared/errors/*` y `src/shared/utils/*` (convenciones comunes)
- `README.md` y esta guia (documentacion final)

## 17. Mini cronograma sugerido (3 personas)

- Dia 1
Dev 1: entidades/interfaces de usuarios.
Dev 2: entidades/interfaces de series/categorias.
Dev 3: entidades/interfaces de temporadas/episodios.

- Dia 2
Dev 1: repositorio + servicio + controlador/view de usuarios.
Dev 2: repositorio + servicio + controlador/view de series/categorias.
Dev 3: repositorio + servicio + controlador/view de temporadas/episodios.

- Dia 3
Todos: integracion en `index.ts/services.ts`, pruebas E2E por consola,
demo de sustentacion y cierre de documentacion.
