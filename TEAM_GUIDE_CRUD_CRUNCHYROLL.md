# Guía de Equipo - CRUD Crunchyroll CLI (TypeScript)

Este documento es la fuente oficial de verdad del equipo.
Si hay dudas sobre qué construir, dónde construirlo o quién es responsable, esta guía manda.

---

## 1. Visión del Proyecto

Construir una app CRUD por consola inspirada en Crunchyroll con:

- estructura limpia por capas
- tipado estricto en TypeScript
- separación clara de responsabilidades
- al menos un decorador en uso
- mensajes de consola para usuario final en español

No se trata solo de que "funcione".
Debe ser entendible, explicable y defendible en la sustentación.

---

## 2. Alcance

### Incluye

- Módulo de usuarios
- Módulo de categorías
- Módulo de series
- Módulo de temporadas y episodios
- Utilidades compartidas, errores y decorador
- Flujo de interacción por consola

### No incluye (salvo tiempo extra)

- Integración con base de datos real (PostgreSQL, MySQL, etc.)
- API HTTP
- Autenticación con tokens
- Suite completa de pruebas automatizadas (con pruebas manuales alcanza para entrega)

---

## 3. Reglas de Arquitectura

Usamos un estilo de Clean Architecture:

- `domain`: entidades y contratos (sin framework/sin IO)
- `application`: reglas de negocio y casos de uso
- `infrastructure`: implementaciones de persistencia
- `presentation`: controladores y vistas para CLI
- `shared`: preocupaciones transversales (errores, decoradores, utilidades)

### Regla de dependencias

Dirección permitida:

- `presentation -> application -> domain`
- `infrastructure -> domain`
- `shared` puede ser usado por todas las capas

No permitido:

- `domain` importando `infrastructure` o `presentation`
- `views` implementando reglas de negocio

---

## 4. Estructura Real Actual (Repositorio)

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

## 5. Estado Actual

### Implementado

- Módulo de usuarios (entidad + interfaz + servicio + repositorio + controlador + vista)
- Módulo de categorías (entidad + interfaz + servicio + repositorio + controlador + vista)
- Módulo de temporadas/episodios (entidad + interfaz + servicio + repositorio + controlador + vista)
- Errores compartidos, decorador y utilidades

### Pendiente por completar

- Flujo completo de series en todas las capas:
  - `SeriesService.ts`
  - `InMemorySeriesRepository.ts`
  - `SeriesController.ts`
  - `SeriesView.ts`
- Menú interactivo completo de CLI en `src/index.ts` (ahora hay demo script)

---

## 6. Modelo de Entidades (Domain)

### User

Campos principales:

- `id`
- `nombre`
- `email`
- `password`
- `rol` (`ADMIN` | `USER`)
- `favoritos[]`
- `historial[]`
- `activo`

### Category

Campos principales:

- `id`
- `name`
- `description`

### Series

Campos principales:

- `id`
- `title`
- `categoryId`
- `seasonIds[]` o relación equivalente

### Season

Campos principales:

- `id`
- `seriesId`
- `number`
- `title`
- `episodeIds[]`

### Episode

Campos principales:

- `id`
- `seasonId`
- `number`
- `title`
- `durationMin`

---

## 7. Matriz CRUD

| Módulo | Create | Read | Update | Delete | Estado |
|---|---|---|---|---|---|
| Users | Sí | Sí | Sí | Sí (soft/hard) | Implementado |
| Categories | Sí | Sí | Sí | Sí | Implementado |
| Seasons | Sí | Sí | Sí | Sí | Implementado |
| Episodes | Sí | Sí | Sí | Sí | Implementado |
| Series | Pendiente | Parcial | Pendiente | Pendiente | Por completar |

---

## 8. Roles del Equipo (3 devs)

- Dev 1: Users
- Dev 2: Series + Categories
- Dev 3: Seasons + Episodes

### Regla global

Cada dev es dueño de un dominio a través de las capas, pero los archivos de integración son compartidos.

---

## 9. Ownership de Archivos - Dev 1 (Users)

### Debe encargarse de

- `src/domain/entities/User.ts`
- `src/domain/interfaces/UserRepository.ts`
- `src/application/services/UserService.ts`
- `src/infrastructure/repositories/InMemoryUserRepository.ts`
- `src/infrastructure/repositories/JsonUserRepository.ts`
- `src/presentation/controllers/UserController.ts`
- `src/presentation/views/UserView.ts`
- `src/data.ts` (sección users)
- `data/users.json`

### Debe entregar

- CRUD completo de usuarios
- Validaciones de permisos admin
- Flujo de favoritos/historial
- Mensajes de consola en español

### Criterio de terminado

- `tsc` pasa
- login + create + list + update + delete funcionando desde CLI

---

## 10. Ownership de Archivos - Dev 2 (Series + Categories)

### Debe encargarse de

- `src/domain/entities/Series.ts`
- `src/domain/entities/Category.ts`
- `src/domain/interfaces/SeriesRepository.ts`
- `src/domain/interfaces/CategoryRepository.ts`
- `src/application/services/SeriesService.ts` (crear)
- `src/application/services/CategoryService.ts`
- `src/infrastructure/repositories/InMemorySeriesRepository.ts` (crear)
- `src/infrastructure/repositories/InMemoryCategoryRepository.ts`
- `src/presentation/controllers/SeriesController.ts` (crear)
- `src/presentation/controllers/CategoryController.ts`
- `src/presentation/views/SeriesView.ts` (crear)
- `src/presentation/views/CategoryView.ts`

### Debe entregar

- CRUD completo de series
- Validación de relación serie-categoría
- Listado/filtro por categoría en series

### Criterio de terminado

- No se puede crear serie con categoría inválida
- Funciona listado/filtro de series por categoría
- Flujos de update/delete validados

---

## 11. Ownership de Archivos - Dev 3 (Seasons + Episodes)

### Debe encargarse de

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

### Debe entregar

- CRUD completo de temporadas y episodios
- Validaciones de relación (season->series, episode->season)
- Validaciones de entrada (`number > 0`, `durationMin > 0`)

### Criterio de terminado

- Create/update/delete de season funciona
- Create/update/delete de episode funciona
- Consultas por `seriesId` y `seasonId` funcionan

---

## 12. Archivos Compartidos de Integración (los 3 devs)

| Archivo | Motivo |
|---|---|
| `src/index.ts` | Composition root + arranque de la app |
| `src/application/services/index.ts` | Export central de servicios |
| `src/infrastructure/repositories/index.ts` | Export central de repositorios |
| `src/presentation/controllers/index.ts` | Export central de controladores |
| `src/presentation/views/index.ts` | Export central de vistas |
| `src/shared/decorators/LogExecution.ts` | Decorador global de logs |
| `src/shared/errors/*` | Errores reutilizables |
| `src/shared/utils/*` | Helpers comunes |
| `README.md` | Vista técnica pública |
| `TEAM_GUIDE_CRUD_CRUNCHYROLL.md` | Guía operativa del equipo |

### Regla compartida

Nadie hace force-push ni reescribe archivos compartidos sin sincronización del equipo.

---

## 13. Estándares de Código

- TypeScript estricto (`no any`).
- Nombres de identificadores en inglés consistentes.
- Mensajes de consola para usuario final en español.
- Comentar solo cuando explique arquitectura o lógica no obvia.
- Evitar código muerto y duplicado.

---

## 14. Estándares de Validación

Como mínimo:

- Strings obligatorios: `trim()` y no vacíos.
- Validar IDs antes de mutar datos.
- Validar duplicados cuando aplique (ejemplo: nombre de categoría).
- Valores numéricos de dominio deben ser positivos donde aplique.

Estrategia de errores:

- `ValidationError` para validaciones/reglas de negocio.
- `NotFoundError` para entidades inexistentes.

---

## 15. Requisito de Decorador

Usar `LogExecution` en métodos importantes de servicio (create/update/remove/login).

Objetivo:

- Mostrar ejecución observable en consola.
- Demostrar uso de decoradores en sustentación.

---

## 16. Política de Salida CLI

- Todos los mensajes finales al usuario en español.
- Mensajes de éxito y error claros.
- No imprimir objetos crudos sin formato.

---

## 17. Flujo de Implementación (orden recomendado)

1. entidades y contratos (`domain`)
2. repositorios y seeds (`infrastructure`)
3. servicios y validaciones (`application`)
4. controladores y vistas (`presentation`)
5. composición en `index.ts`
6. `tsc` + pruebas manuales

---

## 18. Flujo Git

### Inicio diario

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch <tu-rama>
git pull --ff-only origin <tu-rama>
```

### Patrón de commit

```bash
git add -A
git commit -m "feat: descripcion corta y clara"
git push origin <tu-rama>
```

### Antes de merge

- Ejecutar `npx tsc --noEmit`
- Ejecutar demo local en CLI
- Revisar archivos cambiados contra ownership

---

## 19. Protocolo de Conflictos

Si aparece conflicto:

1. Mantener calma.
2. Identificar dueño del archivo según esta guía.
3. Preservar arquitectura por capas.
4. Resolver con dueño presente si es archivo compartido.
5. Re-ejecutar `tsc` + smoke demo.

Nunca usar comandos destructivos (`reset --hard`) sin acuerdo del equipo.

---

## 20. Plan de Pruebas Manuales (mínimo)

### Categories

- Crear categoría válida
- Rechazar nombre vacío
- Rechazar nombre duplicado
- Actualizar categoría existente
- Eliminar categoría existente

### Seasons/Episodes

- Crear temporada válida
- Rechazar temporada con número <= 0
- Crear episodio válido
- Rechazar episodio con duración <= 0
- Listar episodios por temporada

### Users

- Login exitoso/fallido
- Verificación de operaciones solo admin
- Agregar favoritos/historial
- Verificar soft delete

### Global

- Sin crash en flujo normal
- Salida de consola clara y en español

---

## 21. Guion de Sustentación

Estructura sugerida:

1. Explicar capas en 30-45 segundos.
2. Mostrar un CRUD completo en vivo (recomendado: categories).
3. Mostrar una relación cruzada (recomendado: season -> episodes).
4. Mostrar logs del decorador en ejecución.
5. Cerrar con tipado estricto y estrategia de errores.

Frase clave:

"El proyecto está organizado con límites claros por capas: las reglas de negocio viven en servicios, la persistencia en repositorios y la interacción de consola en controladores/vistas de presentación."

---

## 22. Definition of Done (final)

El proyecto se considera terminado solo si se cumple todo:

- CRUD de users funciona
- CRUD de categories funciona
- CRUD de series funciona
- CRUD de seasons/episodes funciona
- Hay al menos un decorador activo en métodos de servicio
- `npx tsc --noEmit` pasa
- README y TEAM_GUIDE actualizados
- Flujo de demo reproducible desde `src/index.ts`

---

## 23. Comandos Rápidos

```bash
bun run src/index.ts
```

```bash
npx tsc --noEmit
```

---

## 24. Notas Finales

- Si código y guía no coinciden, actualiza la guía en el mismo PR.
- Esta guía es parte de la calidad del entregable.
- Priorizar claridad sobre complejidad innecesaria.
