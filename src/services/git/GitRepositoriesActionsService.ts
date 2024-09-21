import { inject, injectable } from 'tsyringe';
import { GitRepositoryService } from './GitRepositoryService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from './GitRepositoriesService';

@injectable()
export class GitRepositoriesActionsService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {
    this.pull = this.pull.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
  }

  async pull() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.pull(name);
    }
  }

  async discardChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.discardChanges(name);
    }
  }

  async stageChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.stageChanges(name);
    }
  }

  async unstageChanges() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.unstageChanges(name);
    }
  }

  async merge(branchName: string) {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      try {
        this.repositoryGitService.merge(name, branchName);
      } catch {}
    }
  }

  async commit(name: string) {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const repoName = getRepositoryName(repo);

      if (!repoName) {
        continue;
      }

      this.repositoryGitService.commit(repoName, name);
    }
  }

  async push() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.push(name);
    }
  }
}
