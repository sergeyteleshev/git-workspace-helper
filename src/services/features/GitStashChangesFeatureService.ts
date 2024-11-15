import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { SimpleGitRepositoriesService } from '../git/SimpleGitRepositoriesService.js';

@injectable(() => [SimpleGitRepositoriesService])
export class GitStashChangesFeatureService extends CommandService {
  constructor(
    private readonly simpleGitRepositoriesService: SimpleGitRepositoriesService
  ) {
    super();
    this.stashChanges = this.stashChanges.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.stashChanges',
      this.stashChanges
    );
  }

  private async stashChanges() {
    const message = await vscode.window.showInputBox({
      placeHolder: 'Enter stash message',
      title: 'Stash changes',
    });

    if (!message) {
      return;
    }

    const repositories =
      await this.simpleGitRepositoriesService.getActiveRepositories();

    for (const repo of repositories) {
      repo.stash([
        'push',
        '--message',
        message || 'Stash changes',
        '--include-untracked',
      ]);
    }
  }
}
