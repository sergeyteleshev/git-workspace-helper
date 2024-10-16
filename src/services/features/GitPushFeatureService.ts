import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import vscode from 'vscode';
import { ExtensionSubscription } from './ExtensionSubscription.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitPushFeatureService extends ExtensionSubscription {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.push = this.push.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.push', this.push);
  }

  async push() {
    const answer = (
      await vscode.window.showQuickPick(['Yes', 'No'], {
        title: 'Push All Commits',
        placeHolder:
          'All of the commits will be pushed to the remote repository. Are you sure?',
      })
    )?.trim();

    if (answer === 'Yes') {
      for (const repo of this.gitRepositoriesService.activeRepositories) {
        const name = getRepositoryName(repo);

        if (!name) {
          continue;
        }

        this.repositoryGitService.push(name);
      }
    }
  }
}
