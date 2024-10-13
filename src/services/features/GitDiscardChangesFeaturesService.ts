// DiscardChangesFeaturesService.ts

import { inject, injectable } from 'tsyringe';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName';
import { GitRepositoriesService } from '../git/GitRepositoriesService';
import { GitRepositoryService } from '../git/GitRepositoryService';
import { BaseFeatureService } from '../base/BaseFeatureService';

@injectable()
export class GitDiscardChangesFeaturesService extends BaseFeatureService {
  constructor(
    @inject(GitRepositoriesService)
    private readonly gitRepositoriesService: GitRepositoriesService,
    @inject(GitRepositoryService)
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.discardChanges = this.discardChanges.bind(this);

    this.setFeature('git-workspace-helper.discardChanges', this.discardChanges);
  }

  async discardChanges() {
    const shouldDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
      title: 'Discard changes',
      placeHolder: 'All of the changes will be removed. Are you sure?',
    });

    if (shouldDelete === 'Yes') {
      for (const repo of this.gitRepositoriesService.activeRepositories) {
        const name = getRepositoryName(repo);

        if (!name) {
          continue;
        }

        this.repositoryGitService.discardChanges(name);
      }
    }
  }
}
