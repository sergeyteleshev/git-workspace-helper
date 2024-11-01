import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';
import { Repository } from '../../types/git.js';

@injectable(() => [GitRepositoriesService])
export class GitUnstageChangesFeatureService extends ExtensionSubscription {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.unstageChanges = this.unstageChanges.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.unstageChanges',
      this.unstageChanges
    );
  }

  async unstage(repo: Repository) {
    const diffWithIndexHead = await repo.diffIndexWithHEAD();
    const staged = diffWithIndexHead.map((change) => change.uri.fsPath);
    const stagedRenamed = diffWithIndexHead
      .map((change) => change.renameUri?.fsPath)
      .filter((path) => typeof path === 'string');
    const stagedAll = [...new Set([...staged, ...stagedRenamed])];

    await repo.revert(stagedAll);
  }

  private async unstageChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      if (!repo) {
        throw new Error('Repository not found');
      }

      this.unstage(repo);
    }
  }
}
