import { inject, injectable } from 'tsyringe';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitMergeFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.merge = this.merge.bind(this);
    this.setFeature('git-workspace-helper.merge', this.merge);
  }

  async merge() {
    const branchesNames = await this.gitRepositoriesService.getBranchesNames();

    const branchName = await vscode.window.showQuickPick(branchesNames, {
      placeHolder: 'Select a branch to merge into the current branch',
      title: 'Merge branch',
    });

    if (!branchName) {
      return;
    }

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
}
