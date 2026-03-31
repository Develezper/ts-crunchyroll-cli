import { UserService } from "./application/services/UserService";
import { JsonUserRepository } from "./infrastructure/repositories/JsonUserRepository";

// Wiring de dependencias e inyección
// Usar el repositorio basado en sistema de archivos (.json)
const userRepository = new JsonUserRepository();
const userService = new UserService(userRepository);

export { userService, userRepository };
