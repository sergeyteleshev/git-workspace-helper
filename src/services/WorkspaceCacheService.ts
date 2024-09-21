import { injectable } from 'tsyringe';
import { VscodeContextService } from './VscodeContextService';

@injectable()
export class WorkSpaceCacheService {
  constructor() {}

  get<T>(key: string): T | undefined {
    return VscodeContextService.context.workspaceState.get<T>(key);
  }

  set<T>(key: string, value: T): void {
    VscodeContextService.context.workspaceState.update(key, value);
  }

  delete(key: string): void {
    VscodeContextService.context.workspaceState.update(key, undefined);
  }

  clear(): void {
    this.keys().forEach((key) => {
      VscodeContextService.context.workspaceState.update(key, undefined);
    });
  }

  has(key: string): boolean {
    return VscodeContextService.context.workspaceState.get(key) !== undefined;
  }

  keys(): string[] {
    return [...VscodeContextService.context.workspaceState.keys()];
  }
}
