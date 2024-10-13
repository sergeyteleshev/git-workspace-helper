import { inject, injectable } from 'tsyringe';
import { GitService } from './GitService';
import { WorkSpaceCacheService } from '../base/WorkspaceCacheService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { isNotNullDefined } from '../../helpers/isNotNullDefined';
import { GitRepositoryService } from './GitRepositoryService';

export const ACTIVE_REPOSITORIES_CACHE_KEY = 'ACTIVE_REPOSITORIES';
const ORIGIN_PREFIX = 'origin/';

@injectable()
export class GitRepositoriesService {
  constructor(
    @inject(GitService) private readonly gitService: GitService,
    @inject(WorkSpaceCacheService)
    private readonly workspaceCacheService: WorkSpaceCacheService,
    @inject(GitRepositoryService)
    private readonly gitRepositoryService: GitRepositoryService
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

  async getBranchesNames() {
    const branchesNames = new Set<string>();

    for (const repo of this.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      const branches = await this.gitRepositoryService.getBranches(name);

      for (const branch of branches) {
        if (branch.name) {
          let name = branch.name;

          if (branch.name.startsWith(ORIGIN_PREFIX)) {
            name = branch.name.replace(ORIGIN_PREFIX, '');
          }

          branchesNames.add(name);
        }
      }
    }

    return Array.from(branchesNames);
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
