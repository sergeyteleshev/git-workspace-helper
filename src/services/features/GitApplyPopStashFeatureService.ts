import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { SimpleGitRepositoriesService } from '../git/SimpleGitRepositoriesService.js';
import { hasNoStashCollision } from '../../helpers/hasStashCollision.js';
import { PickStashService } from '../ui/PickStashService.js';

enum StashAction {
  Pop = 'Pop',
  Apply = 'Apply',
}

@injectable(() => [SimpleGitRepositoriesService, PickStashService])
export class GitApplyPopStashFeatureService extends CommandService {
  constructor(
    private readonly simpleGitRepositoriesService: SimpleGitRepositoriesService,
    private readonly pickStashService: PickStashService
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

    const selectedStash = await this.pickStashService.pickStash({
      title: `${action} stash`,
      placeHolder: 'Select stash',
    });

    if (!selectedStash) {
      return;
    }

    const activeRepositories =
      await this.simpleGitRepositoriesService.getActiveRepositories();

    for (const repo of activeRepositories) {
      const repoStashes =
        await this.simpleGitRepositoriesService.getRepoStashes(repo);
      const stash = repoStashes.find((stash) =>
        hasNoStashCollision(selectedStash, stash)
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
