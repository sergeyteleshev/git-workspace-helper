import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { isSha } from '../../helpers/isSha.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { SettingsService } from '../settings/SettingsService.js';
import { CommandService } from '../base/CommandService.js';
import { Repository } from '../../types/git.js';

enum CheckoutType {
  BranchName = 'By branch name',
  CommitSha = 'By commit SHA',
  DefaultBranch = 'To default branch',
}

const CHECKOUT_OPTIONS: CheckoutType[] = [
  CheckoutType.BranchName,
  CheckoutType.CommitSha,
  CheckoutType.DefaultBranch,
];

@injectable(() => [GitRepositoriesService, SettingsService])
export class GitCheckoutFeatureService extends CommandService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly settingsService: SettingsService
  ) {
    super();
    this.checkout = this.checkout.bind(this);
    this.checkoutByBranchName = this.checkoutByBranchName.bind(this);
    this.checkoutBySha = this.checkoutBySha.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.checkout',
      this.checkout
    );
  }

  async checkoutByBranchName() {
    const branchesNames = await this.gitRepositoriesService.getBranchesNames();

    const branchNameCandidate = await vscode.window.showQuickPick(
      branchesNames,
      {
        placeHolder: 'Enter branch name',
        title: 'Branch name',
      }
    );

    if (!branchNameCandidate) {
      return;
    }

    this.checkoutInEachRepository(branchNameCandidate);
  }

  private checkoutInEachRepository(branchNameOrSha: string) {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const name = getRepositoryName(repo);

      if (!name) {
        continue;
      }

      repo.checkout(branchNameOrSha);
    }
  }

  private async getRepositoryByCommitSha(sha: string) {
    for (const repo of this.gitRepositoriesService.activeRepositories) {
      try {
        const commit = await repo.getCommit(sha);

        if (commit) {
          return repo;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  async checkoutBySha() {
    const shaCandidate = (
      await vscode.window.showInputBox({
        placeHolder: 'Enter commit SHA',
        title: 'Commit SHA',
      })
    )?.trim();

    if (!shaCandidate) {
      return;
    }

    if (!isSha(shaCandidate)) {
      vscode.window.showErrorMessage('Invalid commit SHA');
      return;
    }

    const initialRepo = await this.getRepositoryByCommitSha(shaCandidate);

    if (!initialRepo) {
      throw new Error('Repository not found');
    }

    const restRepos = this.gitRepositoriesService.activeRepositories.filter(
      (repo) => getRepositoryName(repo) !== getRepositoryName(initialRepo)
    );
    const commit = await initialRepo.getCommit(shaCandidate);
    const commitDate = commit.commitDate;
    initialRepo.checkout(shaCandidate);

    for (const repo of restRepos) {
      if (!commitDate) {
        continue;
      }

      const commit = await this.findClosestCommitByDate(repo, commitDate);

      if (commit) {
        repo.checkout(commit.hash);
      }
    }
  }

  private async findClosestCommitByDate(repo: Repository, date: Date) {
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

  async checkout() {
    const result = await vscode.window.showQuickPick(CHECKOUT_OPTIONS);

    if (!result) {
      return;
    }

    if (result === CheckoutType.BranchName) {
      this.checkoutByBranchName();
      return;
    }

    if (result === CheckoutType.CommitSha) {
      this.checkoutBySha();
      return;
    }

    if (result === CheckoutType.DefaultBranch) {
      this.checkoutInEachRepository(this.settingsService.defaultBranchName);
      return;
    }
  }
}
