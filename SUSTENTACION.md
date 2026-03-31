# Guion de Sustentación - ts-crunchyroll-cli

## 1. Qué problema resuelve

Construimos un CRUD de consola inspirado en Crunchyroll para gestionar:

- usuarios
- categorías
- series
- temporadas
- episodios

El foco no es solo que funcione, sino que sea mantenible, tipado y explicable.

## 2. Arquitectura usada

Usamos una arquitectura por capas con responsabilidades claras:

- `domain`: entidades y contratos
- `application`: reglas de negocio
- `infrastructure`: repositorios en memoria
- `presentation`: controladores y vistas de consola
- `shared`: utilidades, errores y decoradores

Beneficio: podemos cambiar la forma de persistir datos sin romper la lógica de negocio.

## 3. Flujo de una operación (ejemplo: crear episodio)

1. El usuario elige opción en `src/index.ts`.
2. El controlador recibe datos y delega al servicio.
3. El servicio valida reglas de negocio.
4. El repositorio persiste en memoria.
5. La vista imprime resultado en consola.

## 4. Reglas de negocio que aplicamos

- Category: nombre obligatorio y único.
- Series: solo se crea con category válida.
- Season: solo se crea con series válida.
- Episode: solo se crea con season válida.
- Temporadas y episodios no admiten número repetido dentro del mismo contexto.
- Duración de episodio > 0.
- No se elimina una categoría con series asociadas.
- Borrado en cascada:
  - eliminar temporada elimina episodios
  - eliminar serie elimina temporadas y episodios
- Solo `ADMIN` puede ejecutar operaciones administrativas de usuarios.

## 5. Requisitos técnicos cumplidos

- CRUD en consola funcionando.
- Clases TypeScript para modelar entidades.
- Decorador en uso: `LogExecution`.
- Tipado estricto sin `any`.
- Separación de responsabilidades por capa.

## 6. Decisiones de diseño importantes

- Entidades separadas por archivo para mantener cohesión de dominio.
- Errores pequeños agrupados en `shared/errors/AppErrors.ts`.
- Utilidades pequeñas agrupadas en `shared/utils/index.ts`.
- Controladores delgados, servicios con reglas de negocio.

## 7. Cómo validar en vivo

```bash
npx tsc --noEmit
bun run src/index.ts
```

Pruebas recomendadas durante demo:

1. Crear/listar categoría y serie.
2. Intentar eliminar categoría con series (debe bloquear).
3. Crear temporada y episodios.
4. Eliminar temporada y comprobar borrado de episodios.
5. Operación de usuarios con rol admin.

## 8. Cierre

Este proyecto demuestra modularidad, tipado estricto y reglas de negocio reales, con una base lista para evolucionar de memoria a base de datos real.
