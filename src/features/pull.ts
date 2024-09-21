import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesActionsService } from '../services/git/GitRepositoriesActionsService';
import { FeatureAction } from '../types/feature';

export const pull: FeatureAction = (context) => {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesActionsService>(
      GitRepositoriesActionsService
    );

  gitRepositoriesService.pull();
};
