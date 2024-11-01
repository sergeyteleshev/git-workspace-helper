import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';
import vscode from 'vscode';

@injectable(() => [GitRepositoriesService])
export class GitStageChangesFeatureService extends ExtensionSubscription {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.stageChanges = this.stageChanges.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.stageChanges',
      this.stageChanges
    );
  }

  async stageChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      if (!repo) {
        throw new Error('Repository not found');
      }

      const diffWithIndexHead = await repo.diffIndexWithHEAD();
      const unstaged = diffWithIndexHead.map((change) => change.uri.fsPath);
      const unstagedRenamed = diffWithIndexHead
        .map((change) => change.renameUri?.fsPath)
        .filter((path) => typeof path === 'string');
      const unstagedAll = [...new Set([...unstaged, ...unstagedRenamed])];

      await repo.add(unstagedAll);
    }
  }
}
