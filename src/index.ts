import { ServicioCategorias, ServicioSeries, ServicioUsuarios } from "./application/services";
import type { Rol, Usuario } from "./domain/entities/User";
import { datosUsuarios } from "./data";
import {
  ControladorCategorias,
  ControladorSeries,
  ControladorUsuarios
} from "./presentation/controllers";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const controladorCategorias = new ControladorCategorias(new ServicioCategorias());
const controladorSeries = new ControladorSeries(new ServicioSeries());
const controladorUsuarios = new ControladorUsuarios(new ServicioUsuarios());

const TEXTO_MENU = `===== MENÚ PRINCIPAL =====

--- CATEGORÍAS ---
1. Listar categorías
2. Crear categoría
3. Buscar categoría por ID
4. Actualizar categoría
5. Eliminar categoría

--- SERIES ---
6. Listar series
7. Crear serie
8. Buscar serie por ID
9. Actualizar serie
10. Eliminar serie
11. Filtrar series por categoría

--- USUARIOS (SOLO ADMIN) ---
12. Listar usuarios activos
13. Crear usuario
14. Actualizar usuario
15. Eliminar usuario (borrado lógico)

0. Salir`;

function esAdmin(usuario: Usuario): boolean {
  return usuario.rol === "ADMIN";
}

function aNumero(valor: string): number | null {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : null;
}

function aRol(valor: string): Rol | null {
  const normalizado = valor.trim().toUpperCase();
  return normalizado === "ADMIN" || normalizado === "USER" ? normalizado : null;
}

async function seleccionarUsuarioSesion(
  lector: ReturnType<typeof createInterface>
): Promise<Usuario> {
  const usuariosActivos = datosUsuarios.filter((usuario) => usuario.activo);
  const usuarios = usuariosActivos.length > 0 ? usuariosActivos : datosUsuarios;

  console.log("\n👤 Selecciona el usuario para iniciar sesión:");
  usuarios.forEach((usuario, indice) => {
    console.log(`${indice + 1}. ${usuario.nombre} (${usuario.rol}) - ${usuario.email}`);
  });

  while (true) {
    const seleccionado = aNumero((await lector.question("\nElige un número de usuario: ")).trim());

    if (
      seleccionado !== null &&
      Number.isInteger(seleccionado) &&
      seleccionado >= 1 &&
      seleccionado <= usuarios.length
    ) {
      const usuarioSeleccionado = usuarios[seleccionado - 1];
      if (usuarioSeleccionado) {
        return usuarioSeleccionado;
      }
    }

    console.log("❌ Selección inválida.");
  }
}

async function iniciarCli(): Promise<void> {
  const lector = createInterface({ input, output });

  const preguntar = (pregunta: string): Promise<string> => lector.question(pregunta);

  const preguntarNumero = async (pregunta: string): Promise<number | null> => {
    const valor = aNumero((await preguntar(pregunta)).trim());
    if (valor === null) {
      console.log("❌ Debes ingresar un número válido.");
    }
    return valor;
  };

  const confirmarEliminacion = async (etiqueta: string): Promise<boolean> => {
    const respuesta = (await preguntar(`¿Seguro que deseas eliminar ${etiqueta}? (s/n): `))
      .trim()
      .toLowerCase();

    return respuesta === "s" || respuesta === "si" || respuesta === "sí";
  };

  console.log("\n🎬 Bienvenido a Crunchyroll CLI");
  const usuarioActual = await seleccionarUsuarioSesion(lector);

  console.log(`\n🔐 Sesión actual: ${usuarioActual.nombre} (${usuarioActual.rol})`);

  while (true) {
    console.log(`\n${TEXTO_MENU}`);

    const opcion = (await preguntar("\nSelecciona una opción: ")).trim();

    if (opcion === "0") {
      console.log("👋 Saliendo de la aplicación...");
      lector.close();
      return;
    }

    if (["12", "13", "14", "15"].includes(opcion) && !esAdmin(usuarioActual)) {
      console.log("❌ Esta opción es solo para usuarios ADMIN.");
      continue;
    }

    switch (opcion) {
      case "1":
        controladorCategorias.listar();
        break;

      case "2": {
        const nombre = await preguntar("Nombre de la categoría: ");
        const descripcion = await preguntar("Descripción: ");
        controladorCategorias.crear(nombre, descripcion);
        break;
      }

      case "3": {
        const id = await preguntarNumero("ID de la categoría: ");
        if (id !== null) {
          controladorCategorias.buscarPorId(id);
        }
        break;
      }

      case "4": {
        const id = await preguntarNumero("ID de la categoría a actualizar: ");
        if (id === null) {
          break;
        }

        const nombre = (await preguntar("Nuevo nombre (enter para omitir): ")).trim();
        const descripcion = (await preguntar("Nueva descripción (enter para omitir): ")).trim();

        controladorCategorias.actualizar(id, {
          nombre: nombre || undefined,
          descripcion: descripcion || undefined
        });
        break;
      }

      case "5": {
        const id = await preguntarNumero("ID de la categoría a eliminar: ");
        if (id === null) {
          break;
        }

        const confirmado = await confirmarEliminacion(`la categoría ${id}`);
        if (!confirmado) {
          console.log("ℹ️ Eliminación cancelada.");
          break;
        }

        controladorCategorias.eliminar(id);
        break;
      }

      case "6":
        controladorSeries.listar();
        break;

      case "7": {
        const titulo = await preguntar("Título de la serie: ");
        const categoriaId = await preguntarNumero("ID de la categoría: ");
        if (categoriaId !== null) {
          controladorSeries.crear(titulo, categoriaId);
        }
        break;
      }

      case "8": {
        const id = await preguntarNumero("ID de la serie: ");
        if (id !== null) {
          controladorSeries.buscarPorId(id);
        }
        break;
      }

      case "9": {
        const id = await preguntarNumero("ID de la serie a actualizar: ");
        if (id === null) {
          break;
        }

        const titulo = (await preguntar("Nuevo título (enter para omitir): ")).trim();
        const entradaCategoria = (await preguntar("Nuevo ID de categoría (enter para omitir): ")).trim();

        let categoriaId: number | undefined;
        if (entradaCategoria) {
          const convertido = aNumero(entradaCategoria);
          if (convertido === null) {
            console.log("❌ Debes ingresar un número válido.");
            break;
          }

          categoriaId = convertido;
        }

        controladorSeries.actualizar(id, {
          titulo: titulo || undefined,
          categoriaId
        });
        break;
      }

      case "10": {
        const id = await preguntarNumero("ID de la serie a eliminar: ");
        if (id === null) {
          break;
        }

        const confirmado = await confirmarEliminacion(`la serie ${id}`);
        if (!confirmado) {
          console.log("ℹ️ Eliminación cancelada.");
          break;
        }

        controladorSeries.eliminar(id);
        break;
      }

      case "11": {
        const categoriaId = await preguntarNumero("ID de la categoría a filtrar: ");
        if (categoriaId !== null) {
          controladorSeries.listarPorCategoria(categoriaId);
        }
        break;
      }

      case "12":
        await controladorUsuarios.listarActivos(usuarioActual);
        break;

      case "13": {
        const nombre = await preguntar("Nombre: ");
        const email = await preguntar("Email: ");
        const password = await preguntar("Contraseña: ");
        const rol = aRol(await preguntar("Rol (ADMIN/USER): "));

        if (!rol) {
          console.log("❌ Rol inválido. Debe ser ADMIN o USER.");
          break;
        }

        await controladorUsuarios.crear(usuarioActual, { nombre, email, password, rol });
        break;
      }

      case "14": {
        const id = await preguntarNumero("ID de usuario a actualizar: ");
        if (id === null) {
          break;
        }

        const nombre = (await preguntar("Nuevo nombre (enter para omitir): ")).trim();
        const email = (await preguntar("Nuevo email (enter para omitir): ")).trim();
        const entradaRol = (await preguntar("Nuevo rol ADMIN/USER (enter para omitir): ")).trim();

        let rol: Rol | undefined;
        if (entradaRol) {
          const rolConvertido = aRol(entradaRol);
          if (!rolConvertido) {
            console.log("❌ Rol inválido. Debe ser ADMIN o USER.");
            break;
          }
          rol = rolConvertido;
        }

        await controladorUsuarios.actualizar(usuarioActual, id, {
          nombre: nombre || undefined,
          email: email || undefined,
          rol
        });
        break;
      }

      case "15": {
        const id = await preguntarNumero("ID de usuario a eliminar: ");
        if (id === null) {
          break;
        }

        const confirmado = await confirmarEliminacion(`el usuario ${id}`);
        if (!confirmado) {
          console.log("ℹ️ Eliminación cancelada.");
          break;
        }

        await controladorUsuarios.eliminar(usuarioActual, id);
        break;
      }

      default:
        console.log("❌ Opción no válida.");
    }
  }
}

void iniciarCli();
