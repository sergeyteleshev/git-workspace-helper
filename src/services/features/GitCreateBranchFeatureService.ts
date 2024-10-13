import { inject, injectable } from 'tsyringe';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import vscode from 'vscode';
import { CustomQuickPick } from '../../ui/CustomQuickPick';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { isNotNullDefined } from '../../helpers/isNotNullDefined';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitCreateBranchFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService,
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService
  ) {
    super();
    this.createBranches = this.createBranches.bind(this);
    this.setFeature('git-workspace-helper.createBranch', this.createBranches);
  }

  async createBranches() {
    const newBranchName = await vscode.window.showInputBox({
      title: 'Create branch',
      placeHolder: 'Enter new branch name',
    });

    if (!newBranchName) {
      return;
    }

    const quickPick = new CustomQuickPick();

    const activeReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    quickPick
      .selectMany()
      .setItems(activeReposNames.map((name) => ({ label: name })));

    const destinationRepos = await quickPick.show();

    if (!isNotNullDefined(destinationRepos)) {
      return;
    }

    for (const repoName of destinationRepos) {
      this.repositoryGitService.createBranch(repoName, newBranchName);
    }
  }
}
