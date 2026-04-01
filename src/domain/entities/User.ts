export type Rol = "ADMIN" | "USER";

export interface PropiedadesUsuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  rol: Rol;
  favoritos: number[];
  historial: number[];
  activo: boolean;
  fechaCreacion: Date;
}

export class Usuario {
  public readonly id: number;
  public nombre: string;
  public email: string;
  public password?: string;
  public rol: Rol;
  public favoritos: number[];
  public historial: number[];
  public activo: boolean;
  public readonly fechaCreacion: Date;

  constructor(propiedades: PropiedadesUsuario) {
    this.id = propiedades.id;
    this.nombre = propiedades.nombre;
    this.email = propiedades.email;
    this.password = propiedades.password;
    this.rol = propiedades.rol;
    this.favoritos = propiedades.favoritos;
    this.historial = propiedades.historial;
    this.activo = propiedades.activo;
    this.fechaCreacion = propiedades.fechaCreacion;
  }
}
