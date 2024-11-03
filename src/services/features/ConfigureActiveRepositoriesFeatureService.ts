import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import { PickRepositoriesService } from '../ui/PickRepositoriesService.js';

@injectable(() => [GitRepositoriesService, PickRepositoriesService])
export class ConfigureActiveRepositoriesFeatureService extends CommandService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly pickRepositoriesService: PickRepositoriesService
  ) {
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
    const selectedReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    const activeRepositories =
      await this.pickRepositoriesService.pickRepositoriesFromAll(
        selectedReposNames
      );

    if (!isNotNullDefined(activeRepositories)) {
      return;
    }

    this.gitRepositoriesService.setActiveRepositories(
      activeRepositories.map(getRepositoryName).filter(isNotNullDefined)
    );
  }
}
