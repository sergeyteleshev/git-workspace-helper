import { injectable } from '@wroud/di';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';
import vscode from 'vscode';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitDeleteTagFeatureService extends ExtensionSubscription {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.deleteTag = this.deleteTag.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.deleteTag',
      this.deleteTag
    );
  }

  async deleteTag() {
    const tagsNames = await this.gitRepositoriesService.getTagsNames();
    const tagName = (
      await vscode.window.showQuickPick(tagsNames, {
        title: 'Delete Tag',
        placeHolder: 'Enter the tag name',
      })
    )?.trim();

    if (!tagName) {
      return;
    }

    for (const repo of this.gitRepositoriesService.activeRepositories) {
      const repoName = getRepositoryName(repo);

      if (!repoName) {
        continue;
      }

      this.repositoryGitService.deleteTag(repoName, tagName);
    }
  }
}
