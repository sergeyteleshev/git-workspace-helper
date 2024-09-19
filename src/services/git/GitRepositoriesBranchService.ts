import { inject, singleton } from 'tsyringe';
import { GitRepositoryService } from './GitRepositoryService';
import { GitService } from './GitService';
import { getRepositoryName } from '../../helpers/getRepositoryName';

const ORIGIN_PREFIX = 'origin/';

@singleton()
export class GitRepositoriesBranchService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(GitService) private readonly gitService: GitService
  ) {}

  async getBranchesNames() {
    const branchesNames = new Set<string>();

    for (const repo of this.gitService.API.repositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      const branches = await this.repositoryGitService.getBranches(name);

      for (const branch of branches) {
        if (branch.name) {
          branchesNames.add(branch.name.replace(ORIGIN_PREFIX, ''));
        }
      }
    }

    return Array.from(branchesNames);
  }
}
