import { ExtensionContext } from 'vscode';

export class VscodeContextService {
  private static _extContext: ExtensionContext;

  public static get context(): ExtensionContext {
    return this._extContext;
  }

  public static set context(ec: ExtensionContext) {
    this._extContext = ec;
  }
}