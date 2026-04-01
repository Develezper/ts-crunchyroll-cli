# Guion De Sustentación - ts-crunchyroll-cli

## 1. Objetivo Del Proyecto

Construimos una aplicación CRUD por consola, inspirada en Crunchyroll, para gestionar:

- Users
- Categories
- Series
- Seasons
- Episodes

La meta no fue solo “que funcione”, sino demostrar:

- arquitectura modular
- tipado estricto
- reglas de negocio claras
- capacidad de explicación técnica por cada integrante

## 2. Reparto De Exposición Por Dev

## 2.1 Dev 1 - Users

### Qué le toca explicar

1. Modelo de usuario y tipos del dominio.
2. Reglas de negocio de usuarios (validaciones, permisos ADMIN, borrado lógico).
3. Persistencia en memoria para usuarios.
4. Flujo CLI de usuarios.

### Archivos que debe dominar

- `src/domain/entities/User.ts`
- `src/domain/interfaces/UserRepository.ts`
- `src/application/services/UserService.ts`
- `src/infrastructure/repositories/InMemoryUserRepository.ts`
- `src/presentation/controllers/UserController.ts`
- `src/presentation/views/UserView.ts`
- `src/data.ts`
- `src/index.ts` (opciones `21` a `24`)
- `src/shared/utils/index.ts` (función `validarAdmin`)

### Mensaje clave para sustentar

"La capa de users implementa CRUD administrativo con seguridad por rol, validaciones de email y borrado lógico, manteniendo separación entre controller, service y repository."

## 2.2 Dev 2 - Categories + Series

### Qué le toca explicar

1. Modelo y contratos de Category y Series.
2. Reglas de negocio:
   - nombre de categoría único
   - serie debe tener categoría existente
   - filtros por categoría
   - bloqueo de eliminación de categoría con series asociadas
3. Persistencia en memoria y operaciones CRUD.
4. Flujo CLI de categorías y series.

### Archivos que debe dominar

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
- `src/infrastructure/database/inMemoryDb.ts` (tablas iniciales de categorías y series)
- `src/index.ts` (opciones `1` a `11`)

### Mensaje clave para sustentar

"En Categories y Series garantizamos integridad referencial y reglas de negocio, con CRUD completo y filtro por categoría, sin mezclar lógica de dominio en la presentación."

## 2.3 Dev 3 - Seasons + Episodes

### Qué le toca explicar

1. Modelo y contratos de Season y Episode.
2. Reglas de negocio:
   - temporada debe pertenecer a serie existente
   - episodio debe pertenecer a temporada existente
   - números no repetidos por contexto
   - duración de episodio > 0
3. Relaciones y consistencia:
   - actualización de `seasonIds` y `episodeIds`
   - borrado en cascada temporada -> episodios
   - borrado en cascada serie -> temporadas -> episodios
4. Flujo CLI de temporadas y episodios.

### Archivos que debe dominar

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
- `src/infrastructure/database/inMemoryDb.ts` (tablas iniciales de seasons y episodes)
- `src/index.ts` (opciones `12` a `20`)

### Mensaje clave para sustentar

"En Seasons y Episodes aplicamos validaciones de relación y unicidad por contexto, además de cascada de borrado para evitar datos huérfanos."

## 2.4 Archivos Compartidos (los 3 devs deben entenderlos)

- `src/index.ts` (menú CLI y orquestación)
- `src/presentation/controllers/BaseController.ts` (manejo común de errores)
- `src/presentation/views/CommonView.ts` (salida estándar)
- `src/shared/decorators/LogExecution.ts`
- `src/shared/errors/AppErrors.ts`
- `src/shared/utils/index.ts`
- `src/application/services/index.ts`
- `src/domain/entities/index.ts`
- `src/domain/interfaces/index.ts`
- `src/infrastructure/repositories/index.ts`

## 3. Temas A Investigar Por Células (Aplicados Al Código)

## 3.1 Clases En TypeScript

### Declaración de clases y constructores

Aplicado en entidades y capas de negocio:

- `src/domain/entities/Category.ts`
- `src/domain/entities/Series.ts`
- `src/domain/entities/Season.ts`
- `src/domain/entities/Episode.ts`
- `src/domain/entities/User.ts`
- Servicios y controladores también usan clases con constructor e inyección de dependencias.

### Modificadores de acceso: public, private, protected

Aplicado en el proyecto:

- `public` en propiedades de entidades como `User`.
- `private readonly` en dependencias de servicios y controladores, por ejemplo en `UserService`, `SeriesService`, `CategoryController`.
- `protected` en `BaseController` para exponer métodos comunes a controladores hijos (`execute`, `executeAsync`, `run`, `runAsync`).

### Herencia con extends

Aplicado aquí:

- `CategoryController extends BaseController`
- `SeriesController extends BaseController`
- `SeasonEpisodeController extends BaseController`
- `UserController extends BaseController`

### Clases abstractas e interfaces

Aplicado en:

- Clase abstracta: `src/presentation/controllers/BaseController.ts`
- Interfaces de repositorio:
  - `src/domain/interfaces/CategoryRepository.ts`
  - `src/domain/interfaces/SeriesRepository.ts`
  - `src/domain/interfaces/SeasonRepository.ts`
  - `src/domain/interfaces/EpisodeRepository.ts`
  - `src/domain/interfaces/UserRepository.ts`

### Métodos estáticos y propiedades readonly

Aplicado en:

- Métodos estáticos en views, por ejemplo `CategoryView.showList`, `UserView.showItem`.
- Propiedades `readonly` en entidades:
  - `id` en `Category`, `Series`, `Season`, `Episode`
  - `id` y `fechaCreacion` en `User`

## 3.2 Namespaces

### Qué son y para qué sirven

Los namespaces son una forma antigua de agrupar código en TypeScript bajo un mismo contenedor global.

### Diferencia entre namespaces y módulos ES

- Namespace: agrupación interna con `namespace X { ... }`.
- Módulos ES: cada archivo es un módulo con `import/export`.

### Cómo lo manejamos en este proyecto

No usamos `namespace`. Usamos módulos ES, que es la práctica recomendada en proyectos modernos Node/TS.

Evidencia en archivos:

- Imports/exports en todas las capas (`src/index.ts`, `src/*/index.ts`, servicios, repositorios, controladores).
- Configuración modular en `tsconfig.json`:
  - `"module": "Preserve"`
  - `"moduleResolution": "bundler"`

### Cuándo usar namespaces (y cuándo no)

- Útiles en escenarios legacy o scripts sin sistema de módulos.
- En proyectos modernos por capas como este, mejor módulos ES.

## 3.3 Decoradores

### Qué son

Son funciones que envuelven o interceptan comportamiento de clases/métodos/propiedades/parámetros.

### Cómo los aplicamos

Creamos un decorador de método:

- `src/shared/decorators/LogExecution.ts`

Lo aplicamos en servicios:

- `UserService` (`@LogExecution()`)
- `CategoryService` (`@LogExecution("Crear categoria")`)
- `SeriesService` (`@LogExecution("Crear serie")`)
- `SeasonService` (`@LogExecution("Crear temporada")`)
- `EpisodeService` (`@LogExecution("Crear episodio")`)

Caso de uso real: logging de ejecución de operaciones clave.

### Nota de tsconfig para decoradores

En este proyecto usamos sintaxis de decoradores estándar de TypeScript moderno (TS 5+), por eso no necesitamos `experimentalDecorators` para esta implementación concreta.

## 4. Requisitos Técnicos Obligatorios (Con Evidencia)

## 4.1 Arquitectura modular `src/`

Cumplido con capas separadas:

- `domain`, `application`, `infrastructure`, `presentation`, `shared`.

## 4.2 Uso de clases TypeScript para entidades

Cumplido en:

- `User`, `Category`, `Series`, `Season`, `Episode`.

## 4.3 Al menos un decorador

Cumplido:

- `@LogExecution` en múltiples métodos de servicios.

## 4.4 Tipado estricto, cero any

Cumplido:

- `tsconfig.json` tiene `"strict": true`.
- Verificación de código sin `any` en `src`.

## 4.5 Separación de responsabilidades

Cumplido:

- `data` e `infrastructure` para datos/persistencia
- `application/services` para reglas de negocio
- `presentation/controllers` para orquestación
- `presentation/views` para salida
- `index.ts` como punto de entrada

## 5. Criterios De Evaluación (Cómo Demostrar Cada Uno)

## 5.1 Funcionalidad

Demostrar en vivo:

1. Ejecutar `bun run src/index.ts`.
2. Mostrar menú funcional y salida limpia.

## 5.2 CRUD completo

Demostrar por dominio:

1. Category: create/read/update/delete.
2. Series: create/read/update/delete + filter by category.
3. Season: create/read/update/delete.
4. Episode: create/read/update/delete.
5. User: list/create/update/soft-delete (admin).

## 5.3 Arquitectura

Explicar flujo de capas con ejemplo:

1. `index.ts` recibe opción.
2. Controller orquesta.
3. Service valida negocio.
4. Repository persiste.
5. View muestra resultado.

## 5.4 Tipado

Evidencia:

1. `strict: true` en `tsconfig.json`.
2. Sin `any` en código fuente.
3. Tipos explícitos en interfaces, entidades, servicios y controladores.

## 5.5 Sustentación

Cada dev explica su módulo asignado con sus archivos.

Se recomienda cerrar con una operación completa:

1. Crear categoría y serie.
2. Crear temporada y episodios.
3. Probar validaciones.
4. Probar borrado en cascada.
5. Probar operación de usuarios con ADMIN.

## 6. Mini Script De Exposición (Orden Sugerido)

1. Dev 1 abre con arquitectura general y users.
2. Dev 2 expone categories/series y reglas de integridad.
3. Dev 3 expone seasons/episodes, cascada y cierre técnico.
4. Cierre conjunto: requisitos cumplidos y resultados de ejecución.

## 7. Comandos De Validación Para La Demo

```bash
npx tsc --noEmit
bun run src/index.ts
```

## 8. Frase Final Recomendada

"Nuestra solución cumple los requisitos técnicos del reto con una arquitectura modular, clases tipadas, decoradores en servicios y reglas de negocio claras, manteniendo el código entendible para escalar y sostener en equipo."
