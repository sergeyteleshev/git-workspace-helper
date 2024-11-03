import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';

@injectable(() => [GitRepositoriesService])
export class DeleteRemoteFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.deleteRemote = this.deleteRemote.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.deleteRemote',
      this.deleteRemote
    );
  }

  async deleteRemote() {
    const remotesNames = await this.gitRepositoriesService.getRemotesNames();
    const remoteName = await vscode.window.showQuickPick(remotesNames, {
      placeHolder: 'Select remote to delete',
      title: 'Delete Remote',
    });

    if (!remoteName) {
      return;
    }

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      repo.removeRemote(remoteName);
    }
  }
}
