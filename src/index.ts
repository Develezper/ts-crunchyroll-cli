import { userService } from "./services";
import { UserController, UserView } from "./moduls";

async function bootstrap() {
    const view = new UserView();
    const controller = new UserController(userService, view);

    console.log("\x1b[36m--- Crunchyroll CLI (Módulo Usuarios DEV 1) ---\x1b[0m");
    console.log("Para facilitar las pruebas, elige el usuario de prueba:");
    console.log("1. admin@crunchy.com (Administrador)");
    console.log("2. user@crunchy.com (Usuario Regular)");

    const seleccion = await view.ask("\nSelecciona (1 o 2): ");
    const targetEmail = seleccion.trim() === "2" ? "user@crunchy.com" : "admin@crunchy.com";

    try {
        // Loguearse solo usando el email seleccionado
        const currentUser = await userService.login(targetEmail);
        await controller.start(currentUser);
    } catch (err: any) {
        view.printError("Fallo en la autenticación: " + err.message);
    } finally {
        controller.closeView();
    }
}

bootstrap().catch(console.error);
