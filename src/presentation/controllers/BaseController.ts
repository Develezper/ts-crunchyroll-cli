import { CommonView } from "../views/CommonView";

type SyncAction<T> = () => T;
type AsyncAction<T> = () => Promise<T>;
type SyncVoidAction = () => void;
type AsyncVoidAction = () => Promise<void>;

export abstract class BaseController {
  protected execute<T>(action: SyncAction<T>): T | undefined {
    try {
      return action();
    } catch (error) {
      CommonView.showError(error);
      return undefined;
    }
  }

  protected async executeAsync<T>(action: AsyncAction<T>): Promise<T | undefined> {
    try {
      return await action();
    } catch (error) {
      CommonView.showError(error);
      return undefined;
    }
  }

  protected run(action: SyncVoidAction): boolean {
    try {
      action();
      return true;
    } catch (error) {
      CommonView.showError(error);
      return false;
    }
  }

  protected async runAsync(action: AsyncVoidAction): Promise<boolean> {
    try {
      await action();
      return true;
    } catch (error) {
      CommonView.showError(error);
      return false;
    }
  }
}
