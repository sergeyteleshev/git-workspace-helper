import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoryTravelService } from '../services/git/GitRepositoryTravelService';

export function pull() {
  const diContainerService = new DIContainerService();
  const gitRepositoryTravelService =
    diContainerService.getByClassName<GitRepositoryTravelService>(
      GitRepositoryTravelService
    );

  gitRepositoryTravelService.pull();
}
