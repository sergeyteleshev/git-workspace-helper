import { injectable } from '@wroud/di';
import { GitRepositoriesService } from './GitRepositoriesService.js';
import { SimpleGit, simpleGit } from 'simple-git';
import { Stash } from '../../types/stash.js';
import { hasNoStashCollision } from '../../helpers/hasStashCollision.js';

@injectable(() => [GitRepositoriesService, GitRepositoriesService])
export class SimpleGitRepositoriesService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {}

  private async getSimpleGitRepository(path: string) {
    return simpleGit(path, { binary: 'git' });
  }

  async getRepoStashes(repo: SimpleGit) {
    const stashList = await repo.stashList();
    const stashes: Stash[] = [];

    for (const [index, stash] of stashList.all.entries()) {
      const messageWithoutBranchName = stash.message.includes(':')
        ? stash.message.replace(/^.*: /, '')
        : stash.message;
      stashes.push({
        ...stash,
        message: messageWithoutBranchName,
        index,
      });
    }

    return stashes;
  }

  async getStashes(): Promise<Stash[]> {
    const stashes: Stash[] = [];
    const repos = await this.getActiveRepositories();

    for (const repo of repos) {
      const repoStashes = await this.getRepoStashes(repo);
      stashes.push(...repoStashes);
    }

    return stashes;
  }

  async getStashesWithoutCollisions() {
    // TODO do it algorithmically right
    const stashes = await this.getStashes();
    return stashes.filter((stash1, index) => {
      return !stashes.some(
        (stash2, index2) =>
          index2 < index && hasNoStashCollision(stash1, stash2)
      );
    });
  }

  getActiveRepositories() {
    return Promise.all(
      this.gitRepositoriesService.activeRepositories.map((repo) => {
        return this.getSimpleGitRepository(repo.rootUri.fsPath);
      })
    );
  }
}
