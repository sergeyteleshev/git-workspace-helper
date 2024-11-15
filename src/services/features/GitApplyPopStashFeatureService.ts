import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { SimpleGitRepositoriesService } from '../git/SimpleGitRepositoriesService.js';
import { constructStashName } from '../../helpers/constructStashName.js';
import { Stash } from '../../types/stash.js';
import { hasNoStashCollision } from '../../helpers/hasStashCollision.js';

enum StashAction {
  Pop = 'Pop',
  Apply = 'Apply',
}

@injectable(() => [SimpleGitRepositoriesService])
export class GitApplyPopStashFeatureService extends CommandService {
  constructor(
    private readonly simpleGitRepositoriesService: SimpleGitRepositoriesService
  ) {
    super();
    this.applyStash = this.applyStash.bind(this);
  }

  async activate() {
    vscode.commands.registerCommand(
      'git-workspace-helper.applyPopStash',
      this.applyStash
    );
  }

  private async applyStash() {
    const action = await vscode.window.showQuickPick(
      [StashAction.Apply, StashAction.Pop],
      {
        title: 'Stash type',
        placeHolder: 'Select stash action',
      }
    );

    if (!action) {
      return;
    }

    const activeRepositories =
      await this.simpleGitRepositoriesService.getActiveRepositories();

    if (activeRepositories.length === 0) {
      vscode.window.showErrorMessage('No active repositories');
      return;
    }

    const stashesWithoutCollisions =
      await this.simpleGitRepositoriesService.getStashesWithoutCollisions();

    if (stashesWithoutCollisions.length === 0) {
      vscode.window.showErrorMessage('No stashes found');
      return;
    }

    const stashName = await vscode.window.showQuickPick(
      stashesWithoutCollisions.map((stash) => constructStashName(stash)),
      {
        title: 'Stash name',
        placeHolder: 'Select stash name',
      }
    );

    if (!stashName) {
      return;
    }

    let initialStash: Stash | undefined = undefined;

    for (const repo of activeRepositories) {
      const repoStashes =
        await this.simpleGitRepositoriesService.getRepoStashes(repo);
      const stash = repoStashes.find(
        (stash) => constructStashName(stash) === stashName
      );

      if (stash) {
        initialStash = stash;
        break;
      }
    }

    if (!initialStash) {
      vscode.window.showErrorMessage('Stash not found');
      return;
    }

    for (const repo of activeRepositories) {
      const repoStashes =
        await this.simpleGitRepositoriesService.getRepoStashes(repo);
      const stash = repoStashes.find((stash) =>
        hasNoStashCollision(initialStash, stash)
      );

      if (!stash) {
        continue;
      }

      repo.stash([
        action === StashAction.Pop ? 'pop' : 'apply',
        '--index',
        stash.index.toString(),
      ]);
    }
  }
}
