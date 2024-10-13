import { inject, injectable } from 'tsyringe';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { BaseFeatureService } from '../base/BaseFeatureService';
import { isNotNullDefined } from '../../helpers/isNotNullDefined';
import { CustomQuickPick } from '../../ui/CustomQuickPick';

@injectable()
export class ConfigureActiveRepositoriesFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {
    super();
    this.configureActiveRepositories =
      this.configureActiveRepositories.bind(this);

    this.setFeature(
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