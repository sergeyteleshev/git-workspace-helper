import { inject, injectable } from 'tsyringe';
import vscode from 'vscode';
import { isSha } from '../../helpers/isSha';
import { BaseFeatureService } from '../base/BaseFeatureService';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { SettingsService } from '../settings/SettingsService';

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

@injectable()
export class GitCheckoutFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(SettingsService) private readonly settingsService: SettingsService
  ) {
    super();
    this.checkout = this.checkout.bind(this);
    this.checkoutByBranchName = this.checkoutByBranchName.bind(this);
    this.checkoutBySha = this.checkoutBySha.bind(this);
    this.checkoutToDefaultBranch = this.checkoutToDefaultBranch.bind(this);
    this.setFeature('git-workspace-helper.checkout', this.checkout);
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

      this.repositoryGitService.goTo(name, branchNameOrSha);
    }
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

    const initialRepoName =
      await this.repositoryGitService.getRepositoryNameByCommitSha(
        shaCandidate
      );

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
      await this.repositoryGitService.getCommitInfo(
        initialRepoName,
        shaCandidate
      )
    ).authorDate;

    this.repositoryGitService.goTo(initialRepoName, shaCandidate);

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

  checkoutToDefaultBranch() {
    this.checkoutInEachRepository(this.settingsService.defaultBranchName);
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
      this.checkoutToDefaultBranch();
      return;
    }
  }
}
