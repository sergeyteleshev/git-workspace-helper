import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';
import { getRepositoryName } from '../helpers/getRepositoryName';
import { CustomQuickPick } from '../ui/CustomQuickPick';
import { FeatureAction } from '../types/feature';
import { isNotNullDefined } from '../helpers/isNotNullDefined';

export const configureActiveRepositories: FeatureAction = async (context) => {
  const diContainer = new DIContainerService();
  const gitRepositoriesService =
    diContainer.getByClassName<GitRepositoriesService>(GitRepositoriesService);
  const allRepoNames = gitRepositoriesService.repositories
    .map(getRepositoryName)
    .filter(isNotNullDefined);
  const quickPick = new CustomQuickPick();
  const selectedReposNames = gitRepositoriesService.activeRepositories
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

  gitRepositoriesService.setActiveRepositories(activeRepositories);
  quickPick.dispose();
};
