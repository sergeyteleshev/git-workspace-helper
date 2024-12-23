import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { CommandService } from '../base/CommandService.js';

@injectable(() => [GitRepositoriesService])
export class GitDeleteBranchFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
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

      const currentBranch = repo.state.HEAD;

      if (currentBranch?.name === branchName) {
        vscode.window.showErrorMessage(
          `The branch "${branchName}" is the current branch of the ${repoName}. Please to switch to another branch and try again.`
        );
        continue;
      }

      repo.deleteBranch(branchName);
    }
  }
}
