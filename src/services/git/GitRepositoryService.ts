import { inject, singleton } from 'tsyringe';
import { GitService } from './GitService.js';
import { Repository } from '../../types/git.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';

@singleton()
export class GitRepositoryService {
  constructor(@inject(GitService) private readonly gitService: GitService) {
    this.findClosestCommitByDate = this.findClosestCommitByDate.bind(this);
    this.goTo = this.goTo.bind(this);
    this.getCommitInfo = this.getCommitInfo.bind(this);
    this.pull = this.pull.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
  }

  private getRepository(name: string) {
    return this.gitService.API.repositories.find(
      (repo) => getRepositoryName(repo) === name
    );
  }

  async findClosestCommitByDate(repoName: string, date: Date) {
    const repo = this.getRepository(repoName);
    let minDifference = Number.MAX_SAFE_INTEGER;
    let minDifferenceCommit = null;

    if (!repo) {
      throw new Error('Repository not found');
    }

    const commits = await repo.log({
      maxEntries: Number.MAX_SAFE_INTEGER,
      sortByAuthorDate: true,
    });

    for (const commit of commits) {
      if (!commit.commitDate) {
        continue;
      }

      const currentDifference = commit.commitDate.getTime() - date.getTime();

      if (currentDifference < 0) {
        break;
      }

      if (currentDifference <= minDifference && currentDifference >= 0) {
        minDifference = currentDifference;
        minDifferenceCommit = commit;
      }
    }

    if (minDifference === Infinity) {
      return null;
    }

    return minDifferenceCommit;
  }

  async getRepositoryNameByCommitSha(sha: string) {
    for (const repo of this.gitService.API.repositories) {
      try {
        const commit = await repo.getCommit(sha);

        if (commit) {
          return getRepositoryName(repo);
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  async goTo(repoName: string, candidate: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await repo.checkout(candidate);
  }

  async getCommitInfo(repoName: string, sha: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    return await repo.getCommit(sha);
  }

  async pull(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await repo.pull();
  }

  async discardChanges(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    repo.checkout('.');
    repo.clean(['-f']);
  }
}
