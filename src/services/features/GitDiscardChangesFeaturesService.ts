import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { CommandService } from '../base/CommandService.js';
import { GitUnstageChangesFeatureService } from './GitUnstageChangesFeatureService.js';

@injectable(() => [GitRepositoriesService, GitUnstageChangesFeatureService])
export class GitDiscardChangesFeaturesService extends CommandService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly gitUnstageChangesFeatureService: GitUnstageChangesFeatureService
  ) {
    super();
    this.discardChanges = this.discardChanges.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.discardChanges',
      this.discardChanges
    );
  }

  async discardChanges() {
    const shouldDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
      title: 'Discard changes',
      placeHolder: 'All of the changes will be removed. Are you sure?',
    });

    if (shouldDelete === 'Yes') {
      for (const repo of this.gitRepositoriesService.activeRepositories) {
        if (!repo) {
          throw new Error('Repository not found');
        }

        await this.gitUnstageChangesFeatureService.unstage(repo);

        const unstaged = repo.state.workingTreeChanges.map(
          (change) => change.uri.fsPath
        );
        const unstagedRenamed = repo.state.workingTreeChanges
          .map((change) => change.renameUri?.fsPath)
          .filter((path) => typeof path === 'string');
        const unstagedAll = [...new Set([...unstaged, ...unstagedRenamed])];

        repo.clean(unstagedAll);
      }
    }
  }
}
