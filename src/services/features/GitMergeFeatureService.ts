import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { ExtensionSubscription } from './ExtensionSubscription.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitMergeFeatureService extends ExtensionSubscription {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.merge = this.merge.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.merge', this.merge);
  }

  async merge() {
    const branchesNames = await this.gitRepositoriesService.getBranchesNames();

    const branchName = await vscode.window.showQuickPick(branchesNames, {
      placeHolder: 'Select a branch to merge into the current branch',
      title: 'Merge branch',
    });

    if (!branchName) {
      return;
    }

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      try {
        this.repositoryGitService.merge(name, branchName);
      } catch {}
    }
  }
}
