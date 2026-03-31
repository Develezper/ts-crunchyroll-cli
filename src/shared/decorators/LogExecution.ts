/**
 * Decorador de método para registrar la ejecución de operaciones importantes en la consola.
 * Cumple con el requerimiento de tener al menos un decorador en el proyecto.
 */
export function LogExecution() {
    return function (originalMethod: any, context: ClassMethodDecoratorContext) {
        return async function (this: any, ...args: any[]) {
            console.log(`\x1b[36m[LOG]\x1b[0m Ejecutando: ${String(context.name)}`);
            try {
                const result = await originalMethod.apply(this, args);
                return result;
            } catch (error: any) {
                console.error(`\x1b[31m[ERROR]\x1b[0m Falla en ${String(context.name)}:`, error.message);
                throw error;
            }
        };
    };
}
