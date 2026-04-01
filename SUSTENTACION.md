# Guion De Sustentación - ts-crunchyroll-cli

## 1. Objetivo Del Proyecto

Aplicación CRUD por consola inspirada en Crunchyroll para gestionar:

- Users
- Categories
- Series

Objetivo técnico:

- TypeScript estricto
- Arquitectura modular simple
- Reglas de negocio claras
- Decoradores en servicios
- Control por rol en CLI

## 2. Reparto De Exposición

## 2.1 Dev 1 - Users

Qué explica:

1. Modelo `User` y tipos (`Rol`, `UserProps`).
2. Reglas ADMIN (crear, listar, actualizar, borrado lógico).
3. Flujo de sesión por rol en CLI.

Archivos clave:

- `src/domain/entities/User.ts`
- `src/application/services/UserService.ts`
- `src/presentation/controllers/UserController.ts`
- `src/presentation/views/UserView.ts`
- `src/data.ts`
- `src/index.ts` (opciones `12` a `15`)

## 2.2 Dev 2 - Categories + Series

Qué explica:

1. CRUD completo de categorías y series.
2. Validaciones de negocio:
   - categoría con nombre obligatorio y único
   - serie con categoría existente
   - filtro de series por categoría
   - bloqueo de borrado de categoría con series asociadas

Archivos clave:

- `src/domain/entities/Category.ts`
- `src/domain/entities/Series.ts`
- `src/application/services/CategoryService.ts`
- `src/application/services/SeriesService.ts`
- `src/presentation/controllers/CategoryController.ts`
- `src/presentation/controllers/SeriesController.ts`
- `src/presentation/views/CategoryView.ts`
- `src/presentation/views/SeriesView.ts`
- `src/infrastructure/database/inMemoryDb.ts`
- `src/index.ts` (opciones `1` a `11`)

## 2.3 Compartido (ambos)

- `src/presentation/controllers/BaseController.ts`
- `src/presentation/views/CommonView.ts`
- `src/shared/decorators/LogExecution.ts`
- `src/shared/errors/AppErrors.ts`
- `src/shared/utils/index.ts`
- `src/application/services/index.ts`

## 3. Temas De La Célula (Dónde se ven)

## 3.1 Clases en TypeScript

- Entidades con constructor: `User`, `Category`, `Series`.
- Servicios y controladores implementados como clases.
- Herencia con `extends`: `UserController`, `CategoryController`, `SeriesController` extienden `BaseController`.
- Clase abstracta: `BaseController`.
- `readonly` en IDs y fecha de creación.

## 3.2 Namespaces

- No se usan namespaces.
- Se usa modularidad moderna ES (`import/export`) en todo el proyecto.

## 3.3 Decoradores

- Decorador implementado en `src/shared/decorators/LogExecution.ts`.
- Uso en servicios:
  - `UserService`
  - `CategoryService`
  - `SeriesService`

## 4. Requisitos Técnicos (Checklist)

- Arquitectura modular en `src/`: cumplido.
- Clases TypeScript para entidades: cumplido.
- Al menos un decorador: cumplido.
- Tipado estricto, cero `any`: cumplido.
- Separación de responsabilidades: cumplido.

## 5. Criterios De Evaluación (Cómo demostrar)

## 5.1 Funcionalidad

1. Ejecutar `bun run src/index.ts`.
2. Seleccionar usuario de sesión.
3. Ejecutar operaciones sin errores.

## 5.2 CRUD completo

1. Category: create/read/update/delete.
2. Series: create/read/update/delete + filtro por categoría.
3. User: list/create/update/soft-delete (solo ADMIN).

## 5.3 Arquitectura

Flujo real:

1. `index.ts` recibe opción.
2. Controller orquesta.
3. Service valida reglas de negocio.
4. Datos en memoria (`inMemoryDb.ts` / `data.ts`).
5. View imprime salida en consola.

## 5.4 Tipado

- `tsconfig.json` con `"strict": true`.
- Código sin `any`.

## 6. Mini Demo Recomendada

1. Entrar como ADMIN.
2. Crear categoría.
3. Crear serie en esa categoría.
4. Filtrar series por categoría.
5. Probar borrado protegido de categoría con series asociadas.
6. Probar CRUD de users (12-15).

## 7. Comandos

```bash
npx tsc --noEmit
bun run src/index.ts
```
