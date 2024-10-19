// DiscardChangesFeaturesService.ts

import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitDiscardChangesFeaturesService extends ExtensionSubscription {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
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
        const name = getRepositoryName(repo);

        if (!name) {
          continue;
        }

        this.repositoryGitService.discardChanges(name);
      }
    }
  }
}
