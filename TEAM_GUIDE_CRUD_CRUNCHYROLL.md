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
- Temporadas
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
- `Season`: id, numero, episodios
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

## 9. Roles sugeridos del equipo

| Rol | Responsabilidad principal | Entregable |
|---|---|---|
| Arquitecto / TL | Define estructura, contratos y estandares | Mapa tecnico + decisiones |
| Domain Dev | Entidades y tipos del dominio | Clases + DTOs tipados |
| Infrastructure Dev | Repositorios in-memory y datos seed | Repos funcionales |
| Application Dev | Casos de uso y reglas de negocio | CRUD + validaciones |
| CLI Dev | Controladores y vistas de consola | Flujo de menu en espanol |
| QA/Doc Dev | Pruebas manuales, checklist y docs | Evidencia de pruebas + guion |

Si el equipo es pequeno, se pueden combinar roles, pero no mezclar responsabilidades en el mismo archivo sin revisiones.

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
