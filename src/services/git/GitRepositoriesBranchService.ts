import { inject, singleton } from 'tsyringe';
import { GitRepositoryService } from './GitRepositoryService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from './GitRepositoriesService';
import { isNotNullDefined } from '../../helpers/isNotNullDefined';

const ORIGIN_PREFIX = 'origin/';

@singleton()
export class GitRepositoriesBranchService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {}

  async getBranchesNames() {
    const branchesNames = new Set<string>();

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      const branches = await this.repositoryGitService.getBranches(name);

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

  async createBranches(branchName: string, filterRepoNames: string[] = []) {
    const destReposNamesSet = new Set(filterRepoNames);

    const activeReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined)
      .filter((name) => destReposNamesSet.has(name));

    for (const repoName of activeReposNames) {
      this.repositoryGitService.createBranch(repoName, branchName);
    }
  }
}
