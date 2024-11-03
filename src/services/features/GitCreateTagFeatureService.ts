import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { PickRepositoriesService } from '../ui/PickRepositoriesService.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';

@injectable(() => [PickRepositoriesService])
export class GitCreateTagFeatureService extends CommandService {
  constructor(
    private readonly pickRepositoriesService: PickRepositoriesService
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

    const repos = await this.pickRepositoriesService.pickRepositories();

    if (!isNotNullDefined(repos)) {
      return;
    }

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
