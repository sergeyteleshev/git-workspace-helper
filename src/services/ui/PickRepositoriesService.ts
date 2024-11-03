import { injectable } from '@wroud/di';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';

@injectable(() => [GitRepositoriesService])
export class PickRepositoriesService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    this.pickRepositories = this.pickRepositories.bind(this);
  }

  async pickRepositories() {
    const quickPick = new CustomQuickPick();

    const activeReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    quickPick
      .selectMany()
      .setItems(activeReposNames.map((name) => ({ label: name })));

    const destinationReposNames = await quickPick.show();

    if (!isNotNullDefined(destinationReposNames)) {
      return;
    }

    const destReposNamesSet = new Set(destinationReposNames);

    return this.gitRepositoriesService.activeRepositories.filter((repo) => {
      const name = getRepositoryName(repo);

      if (!isNotNullDefined(name)) {
        return false;
      }

      return destReposNamesSet.has(name);
    });
  }
}
