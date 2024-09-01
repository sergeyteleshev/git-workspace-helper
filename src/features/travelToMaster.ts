import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoryTravelService } from '../services/git/GitRepositoryTravelService';

export async function travelToMaster() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryTravelService = dIContainerService.getByClassName(
    GitRepositoryTravelService
  );

  gitRepositoryTravelService.travelToMaster();
}
