export class VistaComun {
  static mostrarExito(mensaje: string): void {
    console.log(`✅ ${mensaje}`);
  }

  static mostrarError(error: unknown): void {
    const mensaje = error instanceof Error ? error.message : "Error desconocido.";
    console.error(`❌ ${mensaje}`);
  }
}
