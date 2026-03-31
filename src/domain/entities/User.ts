export type Rol = "ADMIN" | "USER";

export interface UserProps {
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

export class User {
  public readonly id: number;
  public nombre: string;
  public email: string;
  public password?: string;
  public rol: Rol;
  public favoritos: number[];
  public historial: number[];
  public activo: boolean;
  public readonly fechaCreacion: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.email = props.email;
    this.password = props.password;
    this.rol = props.rol;
    this.favoritos = props.favoritos;
    this.historial = props.historial;
    this.activo = props.activo;
    this.fechaCreacion = props.fechaCreacion;
  }
}
