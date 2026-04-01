# Guía De Equipo - Crunchyroll CLI (TypeScript)

## 1. Propósito

Construir una app CRUD por consola en TypeScript, simple de entender y fácil de sustentar.

La salida de consola está en español.

## 2. Estado Actual Del Proyecto

Módulos activos:

- Users
- Categories
- Series

Funcionalidad activa:

- CRUD de Categories
- CRUD de Series + filtro por categoría
- Gestión de Users (listar, crear, actualizar, borrado lógico)
- Decorador `LogExecution` en servicios
- Selección de usuario de sesión al inicio (sin contraseña)
- Restricción por rol: opciones de users (`12` a `15`) solo para `ADMIN`

## 3. Estructura Real

```txt
src/
├── index.ts
├── data.ts
├── domain/
│   └── entities/
│       ├── User.ts
│       ├── Category.ts
│       ├── Series.ts
│       └── index.ts
├── application/
│   └── services/
│       ├── UserService.ts
│       ├── CategoryService.ts
│       ├── SeriesService.ts
│       └── index.ts
├── infrastructure/
│   └── database/
│       ├── inMemoryDb.ts
│       └── index.ts
├── presentation/
│   ├── controllers/
│   │   ├── BaseController.ts
│   │   ├── UserController.ts
│   │   ├── CategoryController.ts
│   │   ├── SeriesController.ts
│   │   └── index.ts
│   └── views/
│       ├── CommonView.ts
│       ├── UserView.ts
│       ├── CategoryView.ts
│       ├── SeriesView.ts
│       └── index.ts
└── shared/
    ├── decorators/
    ├── errors/
    └── utils/
```

## 4. Reglas De Negocio Implementadas

- Category: nombre obligatorio y único.
- Series: `categoryId` debe existir.
- No se puede eliminar una categoría con series asociadas.
- Users admin solo por rol `ADMIN`.

## 5. Reparto De Trabajo

## 5.1 Dev 1 - Users

Archivos foco:

- `src/domain/entities/User.ts`
- `src/application/services/UserService.ts`
- `src/presentation/controllers/UserController.ts`
- `src/presentation/views/UserView.ts`
- `src/data.ts`
- `src/index.ts` (12 a 15)

## 5.2 Dev 2 - Categories + Series

Archivos foco:

- `src/domain/entities/Category.ts`
- `src/domain/entities/Series.ts`
- `src/application/services/CategoryService.ts`
- `src/application/services/SeriesService.ts`
- `src/presentation/controllers/CategoryController.ts`
- `src/presentation/controllers/SeriesController.ts`
- `src/presentation/views/CategoryView.ts`
- `src/presentation/views/SeriesView.ts`
- `src/index.ts` (1 a 11)

## 5.3 Compartido

- `src/index.ts`
- `src/presentation/controllers/BaseController.ts`
- `src/presentation/views/CommonView.ts`
- `src/shared/decorators/LogExecution.ts`
- `src/shared/errors/AppErrors.ts`
- `src/shared/utils/index.ts`
- `README.md`
- `SUSTENTACION.md`

## 6. Relación Con Requisitos Técnicos

- Arquitectura modular: cumplido.
- Clases TypeScript: cumplido.
- Decorador: cumplido.
- Tipado estricto y sin `any`: cumplido.
- Separación de responsabilidades: cumplido.

## 7. Comandos

```bash
npx tsc --noEmit
bun run src/index.ts
```
