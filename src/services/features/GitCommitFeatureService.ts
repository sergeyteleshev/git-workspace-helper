import { inject, injectable } from 'tsyringe';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitCommitFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.commit = this.commit.bind(this);

    this.setFeature('git-workspace-helper.commit', this.commit);
  }

  async commit() {
    const commitName = (
      await vscode.window.showInputBox({
        title: 'Commit Changes',
        placeHolder: 'Enter the commit name',
      })
    )?.trim();

    if (!commitName) {
      return;
    }

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const repoName = getRepositoryName(repo);

      if (!repoName) {
        continue;
      }

      this.repositoryGitService.commit(repoName, commitName);
    }
  }
}
