import { inject, injectable } from 'tsyringe';
import { GitRepositoryService } from './GitRepositoryService';
import { GitService } from './GitService';
import { getRepositoryName } from '../../helpers/getRepositoryName';

@injectable()
export class GitRepositoriesService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(GitService) private readonly gitService: GitService
  ) {
    this.pull = this.pull.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
  }

  async pull() {
    for (const repo of this.gitService.API.repositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.pull(name);
    }
  }

  async discardChanges() {
    for (const repo of this.gitService.API.repositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.discardChanges(name);
    }
  }

  async merge(branchName: string) {
    for (const repo of this.gitService.API.repositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      try {
        this.repositoryGitService.merge(name, branchName);
      } catch {}
    }
  }
}
