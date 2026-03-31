let currentId = 1;

/**
 * Genera IDs numéricos autoincrementales
 */
export function generarId(): number {
    return currentId++;
}

/**
 * Permite setear el ID base en caso de inicializar con datos existentes
 */
export function setGenerarId(baseId: number): void {
    currentId = baseId;
}
