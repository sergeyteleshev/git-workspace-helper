import { inject, singleton } from 'tsyringe';
import { GitRepositoryService } from './GitRepositoryService';
import { GitService } from './GitService';
import { SettingsService } from '../settings/SettingsService';
import { getRepositoryName } from '../../helpers/getRepositoryName';

@singleton()
export class GitRepositoryTravelService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(GitService) private readonly gitService: GitService,
    @inject(SettingsService) private readonly settingsService: SettingsService
  ) {
    this.travelToDefaultBranch = this.travelToDefaultBranch.bind(this);
    this.travelBySha = this.travelBySha.bind(this);
  }

  async travelToDefaultBranch() {
    for (const repo of this.gitService.API.repositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.goTo(name, this.settingsService.branchName);
    }
  }

  async travelByBranchName(branchName: string) {
    for (const repo of this.gitService.API.repositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      this.repositoryGitService.goTo(name, branchName);
    }
  }

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
          branchesNames.add(branch.name);
        }
      }
    }

    return Array.from(branchesNames);
  }

  async travelBySha(sha: string) {
    const initialRepoName =
      await this.repositoryGitService.getRepositoryNameByCommitSha(sha);

    if (!initialRepoName) {
      throw new Error('Repository not found');
    }

    const restRepos = this.gitService.API.repositories.filter(
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
