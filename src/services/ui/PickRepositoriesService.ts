import { injectable } from '@wroud/di';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { Repository } from '../../types/git.js';
import { filterRepositories } from '../../helpers/filterRepositories.js';

@injectable(() => [GitRepositoriesService])
export class PickRepositoriesService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    this.pickRepositoriesFromActive =
      this.pickRepositoriesFromActive.bind(this);
    this.pickRepositoriesFromAll = this.pickRepositoriesFromAll.bind(this);
  }

  async pickRepositoriesFromAll(defaultRepoNames: string[] = []) {
    const destinationReposNames = await pickRepositoriesNames(
      this.gitRepositoriesService.repositories,
      defaultRepoNames
    );

    if (!isNotNullDefined(destinationReposNames)) {
      return;
    }

    return filterRepositories(
      this.gitRepositoriesService.repositories,
      destinationReposNames
    );
  }

  async pickRepositoriesFromActive(defaultRepoNames: string[] = []) {
    const destinationReposNames = await pickRepositoriesNames(
      this.gitRepositoriesService.activeRepositories,
      defaultRepoNames
    );

    if (!isNotNullDefined(destinationReposNames)) {
      return;
    }

    return filterRepositories(
      this.gitRepositoriesService.activeRepositories,
      destinationReposNames
    );
  }
}

async function pickRepositoriesNames(
  repos: Repository[],
  defaultRepoNames: string[]
) {
  const quickPick = new CustomQuickPick();
  const reposNames = repos.map(getRepositoryName).filter(isNotNullDefined);

  quickPick
    .selectMany()
    .setItems(reposNames.map((name) => ({ label: name })))
    .setSelectedItems(defaultRepoNames);

  const repoNames = await quickPick.show();
  quickPick.dispose();

  return repoNames;
}
