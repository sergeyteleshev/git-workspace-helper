import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import vscode from 'vscode';
import { CommandService } from '../base/CommandService.js';

@injectable(() => [GitRepositoriesService])
export class GitPushFeatureService extends CommandService {
  constructor(private readonly gitRepositoriesService: GitRepositoriesService) {
    super();
    this.push = this.push.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand('git-workspace-helper.push', this.push);
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
        repo.push();
      }
    }
  }
}
