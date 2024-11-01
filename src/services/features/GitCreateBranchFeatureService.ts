import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';

@injectable(() => [GitRepositoriesService])
export class GitCreateBranchFeatureService extends ExtensionSubscription {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
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
    const destinationReposSet = new Set(destinationRepos);

    if (!isNotNullDefined(destinationRepos)) {
      return;
    }

    const repos = this.gitRepositoriesService.activeRepositories.filter(
      (repo) => {
        const name = getRepositoryName(repo);

        if (!name) {
          return false;
        }

        return destinationReposSet.has(name);
      }
    );

    for (const repo of repos) {
      repo.createBranch(newBranchName, true);
    }
  }
}
