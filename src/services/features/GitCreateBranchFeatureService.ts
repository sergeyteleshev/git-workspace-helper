import { injectable } from '@wroud/di';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';

@injectable(() => [GitRepositoryService, GitRepositoriesService])
export class GitCreateBranchFeatureService extends ExtensionSubscription {
  constructor(
    private readonly repositoryGitService: GitRepositoryService,
    private readonly gitRepositoriesService: GitRepositoriesService
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

    const quickPick = new CustomQuickPick();

    const activeReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    quickPick
      .selectMany()
      .setItems(activeReposNames.map((name) => ({ label: name })));

    const destinationRepos = await quickPick.show();

    if (!isNotNullDefined(destinationRepos)) {
      return;
    }

    for (const repoName of destinationRepos) {
      this.repositoryGitService.createBranch(repoName, newBranchName);
    }
  }
}
