import { injectable } from '@wroud/di';
import vscode from 'vscode';

@injectable()
export class SettingsService {
  private readonly config: vscode.WorkspaceConfiguration;
  readonly configName = 'git-workspace-helper';

  constructor() {
    this.config = vscode.workspace.getConfiguration(this.configName);
  }

  get defaultBranchName(): string {
    return this.config.get<string>('defaultBranchName')?.trim() || 'master';
  }
}
