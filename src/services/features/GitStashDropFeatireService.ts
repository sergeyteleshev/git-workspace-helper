import { injectable } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import vscode from 'vscode';
import { SimpleGitRepositoriesService } from '../git/SimpleGitRepositoriesService.js';
import { hasNoStashCollision } from '../../helpers/hasStashCollision.js';
import { PickStashService } from '../ui/PickStashService.js';

@injectable(() => [SimpleGitRepositoriesService, PickStashService])
export class GitStashDropFeatureService extends CommandService {
  constructor(
    private readonly simpleGitRepositoriesService: SimpleGitRepositoriesService,
    private readonly pickStashService: PickStashService
  ) {
    super();
    this.dropStash = this.dropStash.bind(this);
  }

  async activate() {
    vscode.commands.registerCommand(
      'git-workspace-helper.dropStash',
      this.dropStash
    );
  }

  private async dropStash() {
    const selectedStash = await this.pickStashService.pickStash({
      title: 'Drop stash',
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

      repo.stash(['drop', stash.index.toString()]);
    }
  }
}
