import { UserService } from "../../application/services/UserService";
import { UserView } from "../views/UserView";
import { User } from "../../domain/entities/User";

export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly view: UserView
    ) { }

    async start(currentUser: User): Promise<void> {
        let exit = false;

        this.view.printSuccess(`Bienvenido/a, ${currentUser.nombre} (${currentUser.rol})`);

        while (!exit) {
            this.view.printMenu();
            const option = await this.view.ask("Seleccione una opción: ");

            try {
                switch (option.trim()) {
                    case "1": {
                        const nombre = await this.view.ask("Nombre: ");
                        const email = await this.view.ask("Email: ");
                        const password = await this.view.ask("Contraseña: ");
                        const rawRol = await this.view.ask("Rol (ADMIN / USER): ");
                        const rol = rawRol.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";

                        await this.userService.createUser(currentUser, { nombre, email, password, rol });
                        this.view.printSuccess("Usuario creado correctamente.");
                        break;
                    }
                    case "2": {
                        const users = await this.userService.getAllActiveUsers(currentUser);
                        this.view.printUsers(users);
                        break;
                    }
                    case "3": {
                        this.view.printProfile(currentUser);
                        break;
                    }
                    case "4": {
                        const idToDelete = await this.view.ask("ID del usuario a eliminar: ");
                        const success = await this.userService.softDeleteUser(currentUser, Number(idToDelete));
                        if (success) {
                            this.view.printSuccess("Usuario eliminado (Borrado lógico) exitosamente.");
                        } else {
                            this.view.printError("Usuario no encontrado.");
                        }
                        break;
                    }
                    case "5": {
                        const seriesId = await this.view.ask("ID de la serie a favoritos: ");
                        await this.userService.addFavorite(currentUser.id, Number(seriesId));
                        this.view.printSuccess("Serie agregada a favoritos.");
                        break;
                    }
                    case "6": {
                        const seriesId = await this.view.ask("ID de la serie a historial: ");
                        await this.userService.watchSeries(currentUser.id, Number(seriesId));
                        this.view.printSuccess("Serie agregada al historial de visualización.");
                        break;
                    }
                    case "0":
                        exit = true;
                        this.view.printSuccess("Saliendo del módulo Usuarios...");
                        break;
                    default:
                        this.view.printError("Opción inválida. Intente de nuevo.");
                }
            } catch (err: any) {
                this.view.printError(err.message);
            }
        }
    }

    closeView(): void {
        this.view.close();
    }
}
