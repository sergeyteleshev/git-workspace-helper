import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';

export async function stageChanges() {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  gitRepositoriesService.stageChanges();
}
