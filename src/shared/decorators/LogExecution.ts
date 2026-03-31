export function LogExecution(message?: string) {
  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) {
    return function (this: This, ...args: Args): Return {
      const label = message ?? `${String(context.name)}`;
      console.log(`[LOG] Ejecutando: ${label}`);
      return target.call(this, ...args);
    };
  };
}
