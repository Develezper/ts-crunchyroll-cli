export class CommonView {
  static showSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  static showError(error: unknown): void {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    console.error(`❌ ${message}`);
  }
}
