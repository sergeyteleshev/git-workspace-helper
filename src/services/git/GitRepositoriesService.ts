import { inject, injectable } from 'tsyringe';
import { GitService } from './GitService';
import { WorkSpaceCacheService } from '../base/WorkspaceCacheService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { isNotNullDefined } from '../../helpers/isNotNullDefined';

export const ACTIVE_REPOSITORIES_CACHE_KEY = 'ACTIVE_REPOSITORIES';

@injectable()
export class GitRepositoriesService {
  constructor(
    @inject(GitService) private readonly gitService: GitService,
    @inject(WorkSpaceCacheService)
    private readonly workspaceCacheService: WorkSpaceCacheService
  ) {
    this.setActiveRepositories = this.setActiveRepositories.bind(this);
    this.restoreDefaultActiveRepositories =
      this.restoreDefaultActiveRepositories.bind(this);

    this.restoreDefaultActiveRepositories();
  }

  private restoreDefaultActiveRepositories() {
    if (this.workspaceCacheService.has(ACTIVE_REPOSITORIES_CACHE_KEY)) {
      return;
    }

    const names = this.repositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    if (!names.length) {
      return;
    }

    this.setActiveRepositories(names);
  }

  get repositories() {
    return this.gitService.API.repositories ?? [];
  }

  get activeRepositories() {
    const names = new Set(
      this.workspaceCacheService.get<string[]>(ACTIVE_REPOSITORIES_CACHE_KEY) ??
        []
    );

    return this.repositories.filter((repo) => {
      const repoName = getRepositoryName(repo);

      if (!repoName) {
        return false;
      }

      return names.has(repoName);
    });
  }

  setActiveRepositories(repositoriesNames: string[]) {
    this.workspaceCacheService.set(
      ACTIVE_REPOSITORIES_CACHE_KEY,
      repositoriesNames
    );
  }
}
