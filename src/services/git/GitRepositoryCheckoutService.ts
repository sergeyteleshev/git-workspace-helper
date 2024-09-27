import { inject, singleton } from 'tsyringe';
import { GitRepositoryService } from './GitRepositoryService';
import { SettingsService } from '../settings/SettingsService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from './GitRepositoriesService';

const ORIGIN_PREFIX = 'origin/';

@singleton()
export class GitRepositoryCheckoutService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(SettingsService) private readonly settingsService: SettingsService,
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {
    this.checkoutToDefaultBranch = this.checkoutToDefaultBranch.bind(this);
    this.checkoutBySha = this.checkoutBySha.bind(this);
  }

  async checkoutToDefaultBranch() {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.goTo(name, this.settingsService.branchName);
    }
  }

  async checkoutByBranchName(branchName: string) {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.goTo(name, branchName);
    }
  }

  async checkoutBySha(sha: string) {
    const initialRepoName =
      await this.repositoryGitService.getRepositoryNameByCommitSha(sha);

    if (!initialRepoName) {
      throw new Error('Repository not found');
    }

    if (
      !this.gitRepositoriesService.activeRepositories
        .map(getRepositoryName)
        .includes(initialRepoName)
    ) {
      throw new Error(
        'Current repository is not active. Please activate it via the command palette'
      );
    }

    const restRepos = this.gitRepositoriesService.activeRepositories.filter(
      (repo) => getRepositoryName(repo) !== initialRepoName
    );
    const commitDate = (
      await this.repositoryGitService.getCommitInfo(initialRepoName, sha)
    ).authorDate;

    this.repositoryGitService.goTo(initialRepoName, sha);

    for (const repo of restRepos) {
      const repoName = getRepositoryName(repo);

      if (!repoName || !commitDate) {
        continue;
      }

      const commit = await this.repositoryGitService.findClosestCommitByDate(
        repoName,
        commitDate
      );

      if (commit) {
        this.repositoryGitService.goTo(repoName, commit.hash);
      }
    }
  }
}
