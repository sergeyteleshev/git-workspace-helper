import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';

@injectable(() => [GitRepositoriesService])
export class GitCommitFeatureService extends ExtensionSubscription {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.commit = this.commit.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.commit', this.commit);
  }

  async commit() {
    const commitName = (
      await vscode.window.showInputBox({
        title: 'Commit Changes',
        placeHolder: 'Enter the commit name',
      })
    )?.trim();

    if (!commitName) {
      return;
    }

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      repo.commit(commitName);
    }
  }
}
