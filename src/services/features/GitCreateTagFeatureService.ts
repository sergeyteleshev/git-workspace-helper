import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { ExtensionSubscription } from '../base/ExtensionSubscription.js';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { CustomQuickPick } from '../../ui/CustomQuickPick.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';

@injectable(() => [GitRepositoriesService])
export class GitCreateTagFeatureService extends ExtensionSubscription {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
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

    const destReposNamesSet = new Set(destinationReposNames);

    const repos = this.gitRepositoriesService.activeRepositories.filter(
      (repo) => {
        const name = getRepositoryName(repo);

        if (!isNotNullDefined(name)) {
          return false;
        }

        return destReposNamesSet.has(name);
      }
    );

    for (const repo of repos) {
      const upstream = repo.state.HEAD?.upstream;

      if (!upstream) {
        continue;
      }

      await repo.tag(tagName, upstream.name);
      repo.checkout(tagName);
    }
  }
}
