import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { CommandService } from '../base/CommandService.js';
import { PickRepositoriesService } from '../ui/PickRepositoriesService.js';

@injectable(() => [PickRepositoriesService])
export class GitCreateBranchFeatureService extends CommandService {
  constructor(
    private readonly pickRepositoriesService: PickRepositoriesService
  ) {
    super();
    this.createBranches = this.createBranches.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.createBranch',
      this.createBranches
    );
  }

  async createBranches() {
    const newBranchName = await vscode.window.showInputBox({
      title: 'Create branch',
      placeHolder: 'Enter new branch name',
    });

    if (!newBranchName) {
      return;
    }

    const repos = await this.pickRepositoriesService.pickRepositories();

    if (!repos) {
      return;
    }

    for (const repo of repos) {
      repo.createBranch(newBranchName, true);
    }
  }
}
