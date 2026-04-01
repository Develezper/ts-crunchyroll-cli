# Presentacion Sustentacion

Esta carpeta contiene una presentacion HTML/CSS/JS separada de la app.

## Archivos

- `index.html`
- `styles.css`
- `script.js`

## Logo de la celula (Kernel)

Coloca el logo en:

- `docs/presentacion/assets/kernel-logo.png`

Cuando exista, se mostrará automáticamente en el header.

Logo remoto configurado actualmente:

- `https://i.ytimg.com/vi/7VRep6FNeIg/maxresdefault.jpg`

Tambien se aceptan estos nombres alternativos:

- `docs/presentacion/assets/kernel-logo.webp`
- `docs/presentacion/assets/kernel-logo.jpg`
- `docs/presentacion/assets/kernel-logo.jpeg`
- `docs/presentacion/assets/crunchyroll-logo.webp`
- `docs/presentacion/assets/crunchyroll-logo.jpg`
- `docs/presentacion/assets/crunchyroll-logo.jpeg`
- `docs/presentacion/assets/crunchyroll.png`
- `docs/presentacion/assets/logo-crunchyroll.png`
- `docs/presentacion/assets/logo.png`

## Capturas de evidencia (rutas exactas)

Coloca estas imágenes en:

- `docs/presentacion/assets/evidencias/01-arquitectura-src.png`
- `docs/presentacion/assets/evidencias/02-user-class-readonly.png`
- `docs/presentacion/assets/evidencias/03-extends-abstract-controller.png`
- `docs/presentacion/assets/evidencias/04-decorator-definition.png`
- `docs/presentacion/assets/evidencias/05-decorator-usage-services.png`
- `docs/presentacion/assets/evidencias/06-tsconfig-strict.png`

Sugerencia de qué capturar:

1. Árbol de carpetas `src/`.
2. `src/domain/entities/User.ts` (readonly y constructor).
3. `src/presentation/controllers/BaseController.ts` + `UserController extends BaseController`.
4. `src/shared/decorators/LogExecution.ts`.
5. Un servicio con `@LogExecution` (por ejemplo `CategoryService.ts`).
6. `tsconfig.json` con `"strict": true`.

## Como abrir

Opcion 1 (rapida):

- abrir `index.html` en el navegador

Opcion 2 (recomendada):

```bash
cd docs/presentacion
python3 -m http.server 5500
```

Luego abrir:

- `http://localhost:5500`

## Nota

La presentacion no toca `src/` ni afecta la ejecucion del CRUD en consola.
