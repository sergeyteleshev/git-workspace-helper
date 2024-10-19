import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { injectable } from '@wroud/di';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';

@injectable(() => [GitRepositoriesService])
export class ConfigureActiveRepositoriesFeatureService extends ExtensionSubscription {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.configureActiveRepositories =
      this.configureActiveRepositories.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.configureActiveRepositories',
      this.configureActiveRepositories
    );
  }

  async configureActiveRepositories() {
    const allRepoNames = this.gitRepositoriesService.repositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);
    const quickPick = new CustomQuickPick();
    const selectedReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    quickPick
      .selectMany()
      .setItems(allRepoNames.map((name) => ({ label: name })))
      .setSelectedItems(selectedReposNames);

    const activeRepositories = await quickPick.show();

    if (!isNotNullDefined(activeRepositories)) {
      return;
    }

    this.gitRepositoriesService.setActiveRepositories(activeRepositories);
    quickPick.dispose();
  }
}
