import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { PickRepositoriesService } from '../ui/PickRepositoriesService.js';
import { isNotNullDefined } from '../../helpers/isNotNullDefined.js';

@injectable(() => [PickRepositoriesService])
export class CreateRemoteFeatureService extends CommandService {
  constructor(
    private readonly pickRepositoriesService: PickRepositoriesService
  ) {
    super();
    this.createRemote = this.createRemote.bind(this);
  }

  async activate() {
    vscode.commands.registerCommand(
      'git-workspace-helper.createRemote',
      this.createRemote
    );
  }

  async createRemote() {
    const remoteName = await vscode.window.showInputBox({
      placeHolder: 'Enter remote name',
      title: 'Remote name',
    });

    if (!remoteName) {
      return;
    }

    const url = await vscode.window.showInputBox({
      placeHolder: 'Enter remote URL',
      title: 'Remote URL',
    });

    if (!url) {
      return;
    }

    const repos =
      await this.pickRepositoriesService.pickRepositoriesFromActive();

    if (!isNotNullDefined(repos)) {
      return;
    }

    for (const repo of repos) {
      repo.addRemote(remoteName, url);
    }
  }
}
