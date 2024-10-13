import { injectable } from '@wroud/di';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { BaseFeatureService } from '../base/BaseFeatureService.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitCommitFeatureService extends BaseFeatureService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
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
