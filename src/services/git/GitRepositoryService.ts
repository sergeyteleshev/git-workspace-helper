import { injectable } from '@wroud/di';
import { GitService } from './GitService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';

@injectable(() => [GitService])
export class GitRepositoryService {
  constructor(private readonly gitService: GitService) {
    this.findClosestCommitByDate = this.findClosestCommitByDate.bind(this);
    this.goTo = this.goTo.bind(this);
    this.getCommitInfo = this.getCommitInfo.bind(this);
    this.pull = this.pull.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
    this.merge = this.merge.bind(this);
    this.commit = this.commit.bind(this);
    this.push = this.push.bind(this);
    this.createBranch = this.createBranch.bind(this);
  }

  private getRepository(name: string) {
    return this.gitService.API.repositories.find(
      (repo) => getRepositoryName(repo) === name
    );
  }

  getCurrentBranch(repoName: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    return repo.state.HEAD;
  }

  async getTags(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    const branches = await repo.getRefs({});

    return branches.filter((branch) => branch.type === 2);
  }

  async getBranches(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    return repo.getBranches({
      sort: 'committerdate',
      remote: true,
    });
  }

  async createBranch(repoName: string, branchName: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await repo.createBranch(branchName, true);
  }

  async deleteBranch(repoName: string, branchName: string, force = false) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await repo.deleteBranch(branchName, force);
  }

  async getCurrentUpstream(repoName: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    return repo.state.HEAD?.upstream;
  }

  async createTag(repoName: string, tagName: string, upstream: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await repo.tag(tagName, upstream);
  }

  async deleteTag(repoName: string, tagName: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await repo.deleteTag(tagName);
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

  async unstageChanges(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    const diffWithIndexHead = await repo.diffIndexWithHEAD();
    const staged = diffWithIndexHead.map((change) => change.uri.fsPath);
    const stagedRenamed = diffWithIndexHead
      .map((change) => change.renameUri?.fsPath)
      .filter((path) => typeof path === 'string');
    const stagedAll = [...new Set([...staged, ...stagedRenamed])];

    await repo.revert(stagedAll);
  }

  async stageChanges(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    const diffWithIndexHead = await repo.diffIndexWithHEAD();
    const unstaged = diffWithIndexHead.map((change) => change.uri.fsPath);
    const unstagedRenamed = diffWithIndexHead
      .map((change) => change.renameUri?.fsPath)
      .filter((path) => typeof path === 'string');
    const unstagedAll = [...new Set([...unstaged, ...unstagedRenamed])];

    await repo.add(unstagedAll);
  }

  async discardChanges(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    await this.unstageChanges(name);

    const unstaged = repo.state.workingTreeChanges.map(
      (change) => change.uri.fsPath
    );
    const unstagedRenamed = repo.state.workingTreeChanges
      .map((change) => change.renameUri?.fsPath)
      .filter((path) => typeof path === 'string');
    const unstagedAll = [...new Set([...unstaged, ...unstagedRenamed])];

    await repo.clean(unstagedAll);
  }

  async merge(repoName: string, branchName: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    const currentBranchName = repo.state.HEAD?.name;

    if (currentBranchName === branchName) {
      return;
    }

    try {
      const branch = await this.getBranch(repoName, branchName);

      if (!branch.name) {
        return;
      }

      await repo.merge(branch.name);
    } catch {}
  }

  getBranch(repoName: string, name: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    return repo.getBranch(name);
  }

  commit(repoName: string, name: string) {
    const repo = this.getRepository(repoName);

    if (!repo) {
      throw new Error('Repository not found');
    }

    repo.commit(name);
  }

  push(name: string) {
    const repo = this.getRepository(name);

    if (!repo) {
      throw new Error('Repository not found');
    }

    repo.push();
  }
}
