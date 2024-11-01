import { injectable } from '@wroud/di';
import { GitService } from './GitService.js';
import { WorkspaceCacheService } from '../base/WorkspaceCacheService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';

export const ACTIVE_REPOSITORIES_CACHE_KEY = 'ACTIVE_REPOSITORIES';
const ORIGIN_PREFIX = 'origin/';

@injectable(() => [GitService, WorkspaceCacheService])
export class GitRepositoriesService {
  constructor(
    private readonly gitService: GitService,
    private readonly workspaceCacheService: WorkspaceCacheService
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

  async getTagsNames(): Promise<string[]> {
    const allTagsNames: string[] = [];

    for (const repo of this.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      const branches = await repo.getRefs({});
      const tags = branches.filter((branch) => branch.type === 2);

      allTagsNames.push(
        ...tags.map((tag) => tag.name).filter(isNotNullDefined)
      );
    }

    return Array.from(new Set(allTagsNames));
  }

  async getBranchesNames(): Promise<string[]> {
    const allBranchesNames: string[] = [];

    for (const repo of this.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      const branches = await repo.getBranches({
        sort: 'committerdate',
        remote: true,
      });
      const branchesNames = branches
        .map((branch) => {
          if (branch.name) {
            let name = branch.name;

            if (branch.name.startsWith(ORIGIN_PREFIX)) {
              name = branch.name.replace(ORIGIN_PREFIX, '');
            }

            return name;
          }

          return null;
        })
        .filter(isNotNullDefined);

      allBranchesNames.push(...branchesNames);
    }

    return Array.from(new Set(allBranchesNames));
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
