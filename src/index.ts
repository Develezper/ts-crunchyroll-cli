import { userService } from "./services";
import { UserController, UserView } from "./moduls";

async function bootstrap() {
    const view = new UserView();
    const controller = new UserController(userService, view);

    console.log("\x1b[36m--- Crunchyroll CLI (Módulo Usuarios DEV 1) ---\x1b[0m");
    console.log("Opciones de Inicio de Sesión:");
    console.log("1. admin@crunchy.com (Administrador / Shortcut)");
    console.log("2. user@crunchy.com (Usuario Regular / Shortcut)");
    console.log("3. Ingresar correo manualmente");

    const seleccion = await view.ask("\nSelecciona (1, 2 o 3): ");

    let targetEmail = "";
    let targetPassword = "";
    if (seleccion.trim() === "2") {
        targetEmail = "user@crunchy.com";
        targetPassword = "123";
    } else if (seleccion.trim() === "3") {
        targetEmail = await view.ask("\nIngresa tu correo: ");
        targetEmail = targetEmail.trim();
        targetPassword = await view.ask("Ingresa tu contraseña: ");
        targetPassword = targetPassword.trim();
    } else {
        targetEmail = "admin@crunchy.com"; // Default for "1" or invalid choices
        targetPassword = "123";
    }

    try {
        // Loguearse usando el email y contraseña seleccionados
        const currentUser = await userService.login(targetEmail, targetPassword);
        await controller.start(currentUser);
    } catch (err: any) {
        view.printError("Fallo en la autenticación: " + err.message);
    } finally {
        controller.closeView();
    }
}

bootstrap().catch(console.error);
