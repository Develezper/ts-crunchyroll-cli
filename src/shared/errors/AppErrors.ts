export class ErrorValidacion extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorValidacion";
  }
}

export class ErrorNoEncontrado extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorNoEncontrado";
  }
}

export class ErrorAutorizacion extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorAutorizacion";
  }
}
