import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';

export function pull() {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  gitRepositoriesService.pull();
}
