import { VistaComun } from "../views/CommonView";

type AccionSincrona<T> = () => T;
type AccionAsincrona<T> = () => Promise<T>;
type AccionSincronaVacia = () => void;
type AccionAsincronaVacia = () => Promise<void>;

export abstract class ControladorBase {
  protected ejecutar<T>(accion: AccionSincrona<T>): T | undefined {
    try {
      return accion();
    } catch (error) {
      VistaComun.mostrarError(error);
      return undefined;
    }
  }

  protected async ejecutarAsync<T>(accion: AccionAsincrona<T>): Promise<T | undefined> {
    try {
      return await accion();
    } catch (error) {
      VistaComun.mostrarError(error);
      return undefined;
    }
  }

  protected ejecutarVacio(accion: AccionSincronaVacia): boolean {
    try {
      accion();
      return true;
    } catch (error) {
      VistaComun.mostrarError(error);
      return false;
    }
  }

  protected async ejecutarVacioAsync(accion: AccionAsincronaVacia): Promise<boolean> {
    try {
      await accion();
      return true;
    } catch (error) {
      VistaComun.mostrarError(error);
      return false;
    }
  }
}
