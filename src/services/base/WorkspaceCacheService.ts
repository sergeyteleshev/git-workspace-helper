import { injectable } from '@wroud/di';
import { IExtensionContext } from '../../IExtensionContext.js';

@injectable(() => [IExtensionContext])
export class WorkspaceCacheService {
  constructor(private readonly context: IExtensionContext) {}

  get<T>(key: string): T | undefined {
    return this.context.workspaceState.get<T>(key);
  }

  set<T>(key: string, value: T): void {
    this.context.workspaceState.update(key, value);
  }

  delete(key: string): void {
    this.context.workspaceState.update(key, undefined);
  }

  clear(): void {
    this.keys().forEach((key) => {
      this.delete(key);
    });
  }

  has(key: string): boolean {
    return this.context.workspaceState.get(key) !== undefined;
  }

  keys(): string[] {
    return [...this.context.workspaceState.keys()];
  }
}
