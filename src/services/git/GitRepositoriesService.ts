import { injectable } from '@wroud/di';
import { GitService } from './GitService.js';
import { WorkspaceCacheService } from '../base/WorkspaceCacheService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';
import { GitRepositoryService } from './GitRepositoryService.js';

export const ACTIVE_REPOSITORIES_CACHE_KEY = 'ACTIVE_REPOSITORIES';
const ORIGIN_PREFIX = 'origin/';

@injectable(() => [GitService, WorkspaceCacheService, GitRepositoryService])
export class GitRepositoriesService {
  constructor(
    private readonly gitService: GitService,
    private readonly workspaceCacheService: WorkspaceCacheService,
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

  async getTagsNames() {
    const tagsNames = new Set<string>();

    for (const repo of this.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      const tags = await this.gitRepositoryService.getTags(name);

      for (const tag of tags) {
        if (tag.name) {
          tagsNames.add(tag.name);
        }
      }
    }

    return Array.from(tagsNames);
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
