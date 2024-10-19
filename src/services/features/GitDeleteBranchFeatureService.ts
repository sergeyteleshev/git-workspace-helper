import { injectable } from '@wroud/di';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { ExtensionSubscription } from './ExtensionSubscription.js';

@injectable(() => [GitRepositoryService, GitRepositoriesService])
export class GitDeleteBranchFeatureService extends ExtensionSubscription {
  constructor(
    private readonly repositoryGitService: GitRepositoryService,
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {
    super();
    this.deleteBranch = this.deleteBranch.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.deleteBranch',
      this.deleteBranch
    );
  }

  async deleteBranch() {
    const branchesNames = await this.gitRepositoriesService.getBranchesNames();
    const branchName = (
      await vscode.window.showQuickPick(branchesNames, {
        title: 'Delete Branch',
        placeHolder: 'Enter the branch name',
      })
    )?.trim();

    if (!branchName) {
      return;
    }

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const repoName = getRepositoryName(repo);

      if (!repoName) {
        continue;
      }

      const currentBranch =
        this.repositoryGitService.getCurrentBranch(repoName);

      if (currentBranch?.name === branchName) {
        vscode.window.showErrorMessage(
          `The branch "${branchName}" is the current branch of the ${repoName}. Please to switch to another branch and try again.`
        );
        continue;
      }

      this.repositoryGitService.deleteBranch(repoName, branchName);
    }
  }
}
