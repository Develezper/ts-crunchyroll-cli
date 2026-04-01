export function RegistrarEjecucion(mensaje?: string) {
  return function <This, Args extends unknown[], Return>(
    objetivo: (this: This, ...args: Args) => Return,
    contexto: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) {
    return function (this: This, ...args: Args): Return {
      const etiqueta = mensaje ?? `${String(contexto.name)}`;
      console.log(`[LOG] Ejecutando: ${etiqueta}`);
      return objetivo.call(this, ...args);
    };
  };
}
