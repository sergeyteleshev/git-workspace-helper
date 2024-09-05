import { singleton } from 'tsyringe';
import vscode from 'vscode';

@singleton()
export class SettingsService {
  private readonly config: vscode.WorkspaceConfiguration;
  readonly configName = 'workspace-time-travel-machine';

  constructor() {
    this.config = vscode.workspace.getConfiguration(this.configName);
  }

  get branchName(): string {
    return this.config.get<string>('defaultBranchName')?.trim() || 'master';
  }
}
