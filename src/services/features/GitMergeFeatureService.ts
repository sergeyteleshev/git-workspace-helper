import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { CommandService } from '../base/CommandService.js';

@injectable(() => [GitRepositoriesService])
export class GitMergeFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
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
      const currentBranchName = repo.state.HEAD?.name;

      if (currentBranchName === branchName) {
        continue;
      }

      try {
        repo.merge(branchName);
      } catch {}
    }
  }
}
