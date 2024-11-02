import { injectable } from '@wroud/di';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';

@injectable(() => [GitRepositoriesService])
export class GitDeleteTagFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
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

      const currentBranch = repo.state.HEAD;

      if (currentBranch?.name === tagName) {
        vscode.window.showErrorMessage(
          `The branch "${tagName}" is the current branch of the ${repoName}. Please to switch to another branch and try again.`
        );
        continue;
      }

      repo.deleteTag(tagName);
    }
  }
}
