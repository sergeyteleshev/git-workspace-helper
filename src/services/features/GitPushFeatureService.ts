import { inject, injectable } from 'tsyringe';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { BaseFeatureService } from '../base/BaseFeatureService';
import vscode from 'vscode';

@injectable()
export class GitPushFeatureService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.push = this.push.bind(this);
    this.setFeature('git-workspace-helper.push', this.push);
  }

  async push() {
    const answer = (
      await vscode.window.showQuickPick(['Yes', 'No'], {
        title: 'Push All Commits',
        placeHolder:
          'All of the commits will be pushed to the remote repository. Are you sure?',
      })
    )?.trim();

    if (answer === 'Yes') {
      for (const repo of this.gitRepositoriesService.activeRepositories) {
        const name = getRepositoryName(repo);

        if (!name) {
          continue;
        }

        this.repositoryGitService.push(name);
      }
    }
  }
}
