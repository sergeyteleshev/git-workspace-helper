import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { GitRepositoryService } from '../git/GitRepositoryService.js';
import { ExtensionSubscription } from './ExtensionSubscription.js';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';

@injectable(() => [GitRepositoriesService, GitRepositoryService])
export class GitCreateTagFeatureService extends ExtensionSubscription {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly repositoryGitService: GitRepositoryService
  ) {
    super();
    this.createTag = this.createTag.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.createTag',
      this.createTag
    );
  }

  async createTag() {
    const tagName = await vscode.window.showInputBox({
      placeHolder: 'Enter tag name',
      title: 'Tag name',
    });

    if (!tagName) {
      return;
    }

    const quickPick = new CustomQuickPick();

    const activeReposNames = this.gitRepositoriesService.activeRepositories
      .map(getRepositoryName)
      .filter(isNotNullDefined);

    quickPick
      .selectMany()
      .setItems(activeReposNames.map((name) => ({ label: name })));

    const destinationReposNames = await quickPick.show();

    if (!isNotNullDefined(destinationReposNames)) {
      return;
    }

    for (const repoName of destinationReposNames) {
      if (!repoName) {
        continue;
      }

      const upstream =
        await this.repositoryGitService.getCurrentUpstream(repoName);

      if (!upstream) {
        continue;
      }

      await this.repositoryGitService.createTag(
        repoName,
        tagName,
        upstream.name
      );
      await this.repositoryGitService.goTo(repoName, tagName);
    }
  }
}
